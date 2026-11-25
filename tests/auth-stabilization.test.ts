import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import express from "express";
import type { AddressInfo } from "node:net";
import { test, type TestContext } from "node:test";
import type { OtpEmailPurpose } from "../src/utils/email";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  preferred_language: string;
  cultural_group_id: number | null;
  is_verified: boolean;
}

interface TestState {
  users: Map<string, User>;
  redis: Map<string, string>;
  redisExpiry: Map<string, number>;
  attempts: Map<string, number>;
  rateLimits: Map<string, { hits: number; expiresAt: number }>;
  emails: Array<{
    email: string;
    otp: string;
    purpose: OtpEmailPurpose;
    subject: string;
    html: string;
    text: string;
  }>;
  nextId: number;
  failEmail: boolean;
  failNextQuery: boolean;
}

const otpKey = (purpose: OtpEmailPurpose, email: string) =>
  `auth-otp:${purpose}:${createHash("sha256")
    .update(email.toLowerCase())
    .digest("hex")}`;

const runAuthApi = async (t: TestContext) => {
  const state: TestState = {
    users: new Map(),
    redis: new Map(),
    redisExpiry: new Map(),
    attempts: new Map(),
    rateLimits: new Map(),
    emails: [],
    nextId: 1,
    failEmail: false,
    failNextQuery: false,
  };

  const previousEmailEnv = {
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
  };
  process.env.BREVO_API_KEY = "test-key";
  process.env.EMAIL_FROM = "test@example.com";

  // Intercept only Brevo; let the test's own requests reach the local server.
  const originalFetch = globalThis.fetch;
  t.mock.method(
    globalThis,
    "fetch",
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      if (!url.startsWith("https://api.brevo.com/")) {
        return originalFetch(input, init);
      }

      const body = JSON.parse(String(init?.body));
      const otp = body.textContent?.match(/\b\d{6}\b/)?.[0];
      if (!otp) throw new Error("OTP missing from email");
      state.emails.push({
        email: body.to[0].email,
        otp,
        purpose: body.subject.includes("password")
          ? "password-reset"
          : "verification",
        subject: body.subject,
        html: body.htmlContent,
        text: body.textContent,
      });
      if (state.failEmail) {
        state.failEmail = false;
        return new Response("delivery failed", { status: 500 });
      }
      return new Response("{}", { status: 201 });
    },
  );

  const { pool } =
    require("../src/database/db") as typeof import("../src/database/db");
  const { redisClient } =
    require("../src/config/redis") as typeof import("../src/config/redis");
  const { runRateLimitRedisCommand } =
    require("./support/rateLimitRedis") as typeof import("./support/rateLimitRedis");
  const {
    createUserQuery,
    getUserByEmail,
    getUserById,
    getUserPasswordByIdQuery,
    getUserForResendOtpQuery,
    updateUserPasswordByIdQuery,
    updateUserPasswordQuery,
    updateUserVerifiedQuery,
  } =
    require("../src/model/auth.queries") as typeof import("../src/model/auth.queries");
  const originalQuery = pool.query;

  const queryStub = async (query: string, values: unknown[] = []) => {
    if (state.failNextQuery) {
      state.failNextQuery = false;
      throw new Error("database unavailable");
    }

    if (query === getUserByEmail || query === getUserForResendOtpQuery) {
      const email = String(values[0]).toLowerCase();
      const user = state.users.get(email);
      return { rows: user ? [{ ...user }] : [] };
    }

    if (query === createUserQuery) {
      const user: User = {
        id: state.nextId++,
        name: String(values[0]),
        email: String(values[1]),
        password: String(values[2]),
        role: "visitor",
        preferred_language: String(values[3]),
        cultural_group_id: null,
        is_verified: false,
      };
      state.users.set(user.email, user);
      return { rows: [{ ...user }] };
    }

    if (query === updateUserVerifiedQuery) {
      const user = state.users.get(String(values[0]).toLowerCase());
      if (!user || user.is_verified) return { rows: [] };
      user.is_verified = true;
      return { rows: [{ ...user }] };
    }

    if (query === getUserById) {
      const user = [...state.users.values()].find(
        (candidate) => candidate.id === Number(values[0]),
      );
      if (!user) return { rows: [] };
      const { password: _password, ...publicUser } = user;
      return { rows: [publicUser] };
    }

    if (query === getUserPasswordByIdQuery) {
      const user = [...state.users.values()].find(
        (candidate) => candidate.id === Number(values[0]),
      );
      return { rows: user ? [{ password: user.password }] : [] };
    }

    if (
      query === updateUserPasswordQuery ||
      query === updateUserPasswordByIdQuery
    ) {
      const user =
        query === updateUserPasswordQuery
          ? state.users.get(String(values[1]).toLowerCase())
          : [...state.users.values()].find(
              (candidate) => candidate.id === Number(values[1]),
            );
      if (!user) return { rows: [] };
      user.password = String(values[0]);
      return {
        rows: [
          { id: user.id, name: user.name, email: user.email, role: user.role },
        ],
      };
    }

    throw new Error(`Unexpected query: ${query}`);
  };

  pool.query = queryStub as typeof pool.query;
  t.mock.method(
    redisClient,
    "get",
    async (key: string) => state.redis.get(key) ?? null,
  );
  t.mock.method(
    redisClient,
    "set",
    async (
      key: string,
      value: string,
      options?: { NX?: boolean; EX?: number },
    ) => {
      if (options?.NX && state.redis.has(key)) return null;
      state.redis.set(key, value);
      if (options?.EX) {
        state.redisExpiry.set(key, Date.now() + options.EX * 1000);
      }
      return "OK";
    },
  );
  t.mock.method(redisClient, "del", async (input: string | string[]) => {
    const keys = Array.isArray(input) ? input : [input];
    let deleted = 0;
    for (const key of keys) {
      if (state.redis.delete(key)) deleted++;
      state.redisExpiry.delete(key);
      state.attempts.delete(key);
    }
    return deleted;
  });
  t.mock.method(redisClient, "expire", async () => 1);
  t.mock.method(redisClient, "ttl", async (key: string) => {
    const expiresAt = state.redisExpiry.get(key);
    if (expiresAt === undefined) return -2;
    const remaining = Math.ceil((expiresAt - Date.now()) / 1000);
    if (remaining <= 0) {
      state.redis.delete(key);
      state.redisExpiry.delete(key);
      return -2;
    }
    return remaining;
  });
  t.mock.method(redisClient, "sendCommand", async (args: readonly unknown[]) =>
    runRateLimitRedisCommand(args, state.rateLimits),
  );
  t.mock.method(
    redisClient,
    "eval",
    async (
      _script: string,
      options: { keys: string[]; arguments: string[] },
    ) => {
      const [codeKey, attemptsKey] = options.keys;
      const [maxAttempts, ttl, digest] = options.arguments;
      if (!state.redis.has(codeKey)) return [-1, 0];
      const attempts = (state.attempts.get(attemptsKey) ?? 0) + 1;
      state.attempts.set(attemptsKey, attempts);
      if (attempts > Number(maxAttempts)) {
        state.redis.delete(codeKey);
        state.attempts.delete(attemptsKey);
        return [-2, 0];
      }
      if (attempts === 1) {
        state.redis.set(attemptsKey, String(attempts));
        state.redisExpiry.set(attemptsKey, Date.now() + Number(ttl) * 1000);
      }
      if (state.redis.get(codeKey) !== digest) {
        return [0, Number(maxAttempts) - attempts];
      }
      state.redis.delete(codeKey);
      state.attempts.delete(attemptsKey);
      state.redisExpiry.delete(codeKey);
      state.redisExpiry.delete(attemptsKey);
      return [1, 0];
    },
  );
  t.mock.method(redisClient, "scanIterator", async function* () {
    yield [...state.redis.keys()].filter((key) => key.startsWith("session:"));
  });
  const rateLimitSettings = [
    "AUTH_LIMIT",
    "SIGNUP_LIMIT",
    "SIGNIN_LIMIT",
    "GOOGLE_AUTH_LIMIT",
    "OTP_VERIFY_LIMIT",
    "OTP_RESEND_LIMIT",
    "PASSWORD_RESET_REQUEST_LIMIT",
    "PASSWORD_RESET_LIMIT",
    "PASSWORD_CHANGE_LIMIT",
    "ADMIN_SETUP_LIMIT",
  ];
  const previousRateLimitSettings = new Map(
    rateLimitSettings.map((key) => [key, process.env[key]]),
  );
  for (const key of rateLimitSettings) process.env[key] = "1000";

  const authRoutes = (
    require("../src/routes/auth.routes") as typeof import("../src/routes/auth.routes")
  ).default;
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/auth", authRoutes);
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  t.after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
      server.closeAllConnections();
    });
    pool.query = originalQuery;
    for (const [key, value] of Object.entries(previousEmailEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    for (const [key, value] of previousRateLimitSettings) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  return {
    state,
    request: (
      path: string,
      options: { method?: string; body?: unknown; cookie?: string } = {},
    ) =>
      fetch(`${baseUrl}${path}`, {
        method: options.method ?? "GET",
        headers: {
          ...(options.body === undefined
            ? {}
            : { "Content-Type": "application/json" }),
          ...(options.cookie ? { Cookie: options.cookie } : {}),
        },
        ...(options.body === undefined
          ? {}
          : { body: JSON.stringify(options.body) }),
      }),
    addUser: async (email: string, password: string) => {
      const user: User = {
        id: state.nextId++,
        name: email.split("@")[0],
        email,
        password: await bcrypt.hash(password, 10),
        role: "visitor",
        preferred_language: "en",
        cultural_group_id: null,
        is_verified: true,
      };
      state.users.set(email, user);
      return user;
    },
  };
};

const readBody = async (response: Response) =>
  (await response.json()) as {
    message: string;
    code?: string;
    data: Record<string, unknown> | null;
  };

const responseCookie = (response: Response) =>
  response.headers.get("set-cookie")?.split(";")[0] ?? "";

test("auth registration, OTP, recovery, session isolation, and password changes", async (t) => {
  const api = await runAuthApi(t);
  const originalPassword = "InitialPass123!";
  const verificationEmail = "verify@example.com";

  await t.test(
    "registration and existing-account duplicate handling",
    async () => {
      const response = await api.request("/auth/signup", {
        method: "POST",
        body: {
          name: "Original User",
          email: verificationEmail,
          password: originalPassword,
        },
      });
      assert.equal(response.status, 201);
      const signupBody = await readBody(response);
      assert.equal(signupBody.code, "OTP_SENT");
      assert.equal(signupBody.data?.id, 1);
      assert.equal(signupBody.data?.otpSent, true);
      assert.equal(signupBody.data?.requiresVerification, true);
      assert.equal(signupBody.data?.nextStep, "verify-otp");
      const verificationEmailSent = api.state.emails[0];
      assert.equal(verificationEmailSent.purpose, "verification");
      assert.equal(verificationEmailSent.subject, "Verify your REKÒ account");
      assert.match(verificationEmailSent.html, /VERIFICATION CODE/);

      const otp = api.state.emails[0].otp;
      const reRegistration = await api.request("/auth/signup", {
        method: "POST",
        body: {
          name: "Different Person",
          email: verificationEmail,
          password: "ReplacementPass123!",
        },
      });
      assert.equal(reRegistration.status, 409);
      const unverifiedDuplicate = await readBody(reRegistration);
      assert.equal(unverifiedDuplicate.code, "EMAIL_REQUIRES_VERIFICATION");
      assert.equal(unverifiedDuplicate.data?.accountVerified, false);
      assert.equal(unverifiedDuplicate.data?.canRequestOtp, true);
      assert.equal(unverifiedDuplicate.data?.nextStep, "resend-otp");
      assert.equal(api.state.emails.length, 1);
      assert.equal(
        api.state.users.get(verificationEmail)?.name,
        "Original User",
      );
      assert.equal(
        await bcrypt.compare(
          originalPassword,
          api.state.users.get(verificationEmail)!.password,
        ),
        true,
      );

      const resendDuringCooldown = await api.request("/auth/resend-otp", {
        method: "POST",
        body: { email: verificationEmail },
      });
      assert.equal(resendDuringCooldown.status, 429);
      const cooldownBody = await readBody(resendDuringCooldown);
      assert.equal(cooldownBody.code, "OTP_COOLDOWN");
      assert.equal(cooldownBody.data?.cooldownActive, true);
      assert.equal(cooldownBody.data?.otpAlreadySent, null);
      assert.ok(Number(cooldownBody.data?.retryAfterSeconds) > 0);

      const verified = await api.request("/auth/verify-otp", {
        method: "POST",
        body: { email: verificationEmail, otp },
      });
      assert.equal(verified.status, 200);
      assert.equal((await readBody(verified)).code, "EMAIL_VERIFIED");
      assert.equal(api.state.users.get(verificationEmail)?.is_verified, true);

      const duplicate = await api.request("/auth/signup", {
        method: "POST",
        body: {
          name: "Another User",
          email: verificationEmail,
          password: "OtherPass123!",
        },
      });
      assert.equal(duplicate.status, 409);
      assert.equal((await readBody(duplicate)).code, "EMAIL_ALREADY_EXISTS");
      assert.equal(api.state.emails.length, 1);

      const reusedOtp = await api.request("/auth/verify-otp", {
        method: "POST",
        body: { email: verificationEmail, otp },
      });
      assert.equal(reusedOtp.status, 400);
      assert.equal((await readBody(reusedOtp)).code, "OTP_EXPIRED");
    },
  );

  await t.test("expired and over-attempt OTPs are rejected", async () => {
    const expiredEmail = "expired@example.com";
    await api.request("/auth/signup", {
      method: "POST",
      body: {
        name: "Expired User",
        email: expiredEmail,
        password: originalPassword,
      },
    });
    const expiredOtp = api.state.emails.at(-1)!.otp;
    api.state.redis.delete(otpKey("verification", expiredEmail));
    const expired = await api.request("/auth/verify-otp", {
      method: "POST",
      body: { email: expiredEmail, otp: expiredOtp },
    });
    assert.equal(expired.status, 400);
    assert.equal((await readBody(expired)).code, "OTP_EXPIRED");

    const limitedEmail = "limited@example.com";
    await api.request("/auth/signup", {
      method: "POST",
      body: {
        name: "Limited User",
        email: limitedEmail,
        password: originalPassword,
      },
    });
    const limitedOtp = api.state.emails.at(-1)!.otp;
    const invalidOtp = limitedOtp === "000000" ? "000001" : "000000";
    for (let attempt = 0; attempt < 5; attempt++) {
      const invalid = await api.request("/auth/verify-otp", {
        method: "POST",
        body: { email: limitedEmail, otp: invalidOtp },
      });
      assert.equal(invalid.status, 400);
      assert.equal((await readBody(invalid)).code, "INVALID_OTP");
    }
    const rejectedValidCode = await api.request("/auth/verify-otp", {
      method: "POST",
      body: { email: limitedEmail, otp: limitedOtp },
    });
    assert.equal(rejectedValidCode.status, 429);
    assert.equal(
      (await readBody(rejectedValidCode)).code,
      "OTP_ATTEMPTS_EXCEEDED",
    );
  });

  await t.test(
    "password recovery uses a distinct OTP and revokes sessions",
    async () => {
      const login = await api.request("/auth/signin", {
        method: "POST",
        body: { email: verificationEmail, password: originalPassword },
      });
      assert.equal(login.status, 200);
      assert.equal((await readBody(login)).code, "LOGIN_SUCCESS");
      const oldSession = responseCookie(login);

      const forgot = await api.request("/auth/forgot-password", {
        method: "POST",
        body: { email: verificationEmail },
      });
      assert.equal(forgot.status, 200);
      const forgotBody = await readBody(forgot);
      assert.equal(forgotBody.code, "PASSWORD_RESET_REQUEST_ACCEPTED");
      assert.equal(forgotBody.data?.otpSent, null);

      const unknownForgot = await api.request("/auth/forgot-password", {
        method: "POST",
        body: { email: "unknown@example.com" },
      });
      assert.equal(unknownForgot.status, 200);
      assert.deepEqual(await readBody(unknownForgot), forgotBody);

      const repeatedForgot = await api.request("/auth/forgot-password", {
        method: "POST",
        body: { email: verificationEmail },
      });
      assert.equal(repeatedForgot.status, 200);
      assert.deepEqual(await readBody(repeatedForgot), forgotBody);
      const recovery = api.state.emails.at(-1)!;
      assert.equal(recovery.purpose, "password-reset");
      assert.equal(recovery.subject, "Reset your REKÒ password");
      assert.match(recovery.html, /PASSWORD RESET CODE/);
      assert.match(recovery.text, /password reset code/);

      const wrongPurpose = await api.request("/auth/verify-otp", {
        method: "POST",
        body: { email: verificationEmail, otp: recovery.otp },
      });
      assert.equal(wrongPurpose.status, 400);
      assert.equal((await readBody(wrongPurpose)).code, "OTP_EXPIRED");

      const reset = await api.request("/auth/reset-password", {
        method: "POST",
        body: {
          email: verificationEmail,
          otp: recovery.otp,
          newPassword: "ResetPass123!",
        },
      });
      assert.equal(reset.status, 200);
      assert.equal((await readBody(reset)).code, "PASSWORD_RESET");

      const staleSession = await api.request("/auth/me", {
        cookie: oldSession,
      });
      assert.equal(staleSession.status, 401);
      const oldPassword = await api.request("/auth/signin", {
        method: "POST",
        body: { email: verificationEmail, password: originalPassword },
      });
      assert.equal(oldPassword.status, 401);
    },
  );

  await t.test(
    "current-user and logout resolve only the cookie's session",
    async () => {
      const aliceFirst = await api.request("/auth/signin", {
        method: "POST",
        body: { email: verificationEmail, password: "ResetPass123!" },
      });
      const aliceFirstCookie = responseCookie(aliceFirst);
      const bob = await api.addUser("bob@example.com", "BobPass123!");
      const bobLogin = await api.request("/auth/signin", {
        method: "POST",
        body: { email: bob.email, password: "BobPass123!" },
      });
      const bobCookie = responseCookie(bobLogin);

      const aliceMe = await api.request("/auth/me", {
        cookie: aliceFirstCookie,
      });
      const bobMe = await api.request("/auth/me", { cookie: bobCookie });
      assert.equal((await readBody(aliceMe)).data?.email, verificationEmail);
      assert.equal((await readBody(bobMe)).data?.email, bob.email);
      assert.equal(aliceMe.headers.get("cache-control"), "private, no-store");

      api.state.redis.set("session:malformed", "not-json");
      const malformedSession = await api.request("/auth/me", {
        cookie: "sessionId=malformed",
      });
      assert.equal(malformedSession.status, 401);
      assert.equal(api.state.redis.has("session:malformed"), false);

      const aliceSecond = await api.request("/auth/signin", {
        method: "POST",
        body: { email: verificationEmail, password: "ResetPass123!" },
      });
      const aliceSecondCookie = responseCookie(aliceSecond);
      const wrongPassword = await api.request("/auth/change-password", {
        method: "POST",
        cookie: aliceSecondCookie,
        body: {
          currentPassword: "WrongPass123!",
          newPassword: "ChangedPass123!",
        },
      });
      assert.equal(wrongPassword.status, 400);

      api.state.redis.set("session:malformed-revoke", "not-json");
      const changed = await api.request("/auth/change-password", {
        method: "POST",
        cookie: aliceSecondCookie,
        body: {
          currentPassword: "ResetPass123!",
          newPassword: "ChangedPass123!",
        },
      });
      assert.equal(changed.status, 200);
      assert.equal((await readBody(changed)).code, "PASSWORD_CHANGED");

      const revokedAliceSession = await api.request("/auth/me", {
        cookie: aliceFirstCookie,
      });
      const keptAliceSession = await api.request("/auth/me", {
        cookie: aliceSecondCookie,
      });
      assert.equal(revokedAliceSession.status, 401);
      assert.equal(keptAliceSession.status, 200);
      assert.equal(api.state.redis.has("session:malformed-revoke"), false);

      const oldPassword = await api.request("/auth/signin", {
        method: "POST",
        body: { email: verificationEmail, password: "ResetPass123!" },
      });
      assert.equal(oldPassword.status, 401);
      const newPassword = await api.request("/auth/signin", {
        method: "POST",
        body: { email: verificationEmail, password: "ChangedPass123!" },
      });
      assert.equal(newPassword.status, 200);

      const logout = await api.request("/auth/logout", {
        method: "POST",
        cookie: bobCookie,
      });
      assert.equal(logout.status, 200);
      const loggedOut = await api.request("/auth/me", { cookie: bobCookie });
      assert.equal(loggedOut.status, 401);
      const aliceStillAuthenticated = await api.request("/auth/me", {
        cookie: aliceSecondCookie,
      });
      assert.equal(aliceStillAuthenticated.status, 200);
    },
  );

  await t.test(
    "recovery delivery failures remain private and can be retried",
    async () => {
      const retryEmail = "retry@example.com";
      await api.addUser(retryEmail, originalPassword);
      api.state.failEmail = true;
      const failedDelivery = await api.request("/auth/forgot-password", {
        method: "POST",
        body: { email: retryEmail },
      });
      assert.equal(failedDelivery.status, 200);
      assert.equal(
        (await readBody(failedDelivery)).code,
        "PASSWORD_RESET_REQUEST_ACCEPTED",
      );
      assert.equal(
        api.state.redis.has(otpKey("password-reset", retryEmail)),
        false,
      );

      const retry = await api.request("/auth/forgot-password", {
        method: "POST",
        body: { email: retryEmail },
      });
      assert.equal(retry.status, 200);
      assert.equal(
        api.state.emails.filter((email) => email.email === retryEmail).length,
        2,
      );

      api.state.failNextQuery = true;
      const databaseFailure = await api.request("/auth/forgot-password", {
        method: "POST",
        body: { email: "database-error@example.com" },
      });
      assert.equal(databaseFailure.status, 500);
      assert.equal(
        (await readBody(databaseFailure)).message,
        "Internal server error",
      );
    },
  );
});
