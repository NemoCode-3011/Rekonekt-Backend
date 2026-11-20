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
  attempts: Map<string, number>;
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
    attempts: new Map(),
    emails: [],
    nextId: 1,
    failEmail: false,
    failNextQuery: false,
  };
  const nodemailer = require("nodemailer");
  const originalCreateTransport = nodemailer.createTransport;
  nodemailer.createTransport = () => ({
    sendMail: async (options: {
      to: string;
      subject: string;
      text: string;
      html: string;
    }) => {
      const otp = options.text.match(/\b\d{6}\b/)?.[0];
      if (!otp) throw new Error("OTP missing from email");
      state.emails.push({
        email: options.to,
        otp,
        purpose: options.subject.includes("password")
          ? "password-reset"
          : "verification",
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      if (state.failEmail) {
        state.failEmail = false;
        throw new Error("email delivery failed");
      }
      return { messageId: "test-message" };
    },
  });
  const { pool } = require("../src/database/db") as typeof import("../src/database/db");
  const { redisClient } = require("../src/config/redis") as typeof import("../src/config/redis");
  const {
    createUserQuery,
    getUserByEmail,
    getUserById,
    getUserPasswordByIdQuery,
    getUserForResendOtpQuery,
    updateUserPasswordByIdQuery,
    updateUserPasswordQuery,
    updateUserVerifiedQuery,
  } = require("../src/model/auth.queries") as typeof import("../src/model/auth.queries");
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
      return { rows: [{ id: user.id, name: user.name, email: user.email, role: user.role }] };
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
      return "OK";
    },
  );
  t.mock.method(redisClient, "del", async (input: string | string[]) => {
    const keys = Array.isArray(input) ? input : [input];
    let deleted = 0;
    for (const key of keys) {
      if (state.redis.delete(key)) deleted++;
    }
    return deleted;
  });
  t.mock.method(redisClient, "expire", async () => 1);
  t.mock.method(
    redisClient,
    "eval",
    async (
      _script: string,
      options: { keys: string[]; arguments: string[] },
    ) => {
      const [codeKey, attemptsKey] = options.keys;
      const [maxAttempts, _ttl, digest] = options.arguments;
      const attempts = (state.attempts.get(attemptsKey) ?? 0) + 1;
      state.attempts.set(attemptsKey, attempts);
      if (attempts > Number(maxAttempts)) {
        state.redis.delete(codeKey);
        return 0;
      }
      if (state.redis.get(codeKey) !== digest) return 0;
      state.redis.delete(codeKey);
      state.attempts.delete(attemptsKey);
      return 1;
    },
  );
  t.mock.method(
    redisClient,
    "scanIterator",
    async function* () {
      yield [...state.redis.keys()].filter((key) =>
        key.startsWith("session:"),
      );
    },
  );
  const authRoutes =
    (require("../src/routes/auth.routes") as typeof import("../src/routes/auth.routes")).default;
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
    nodemailer.createTransport = originalCreateTransport;
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
    data: Record<string, unknown> | null;
  };

const responseCookie = (response: Response) =>
  response.headers.get("set-cookie")?.split(";")[0] ?? "";

test("auth registration, OTP, recovery, session isolation, and password changes", async (t) => {
  const api = await runAuthApi(t);
  const originalPassword = "InitialPass123!";
  const verificationEmail = "verify@example.com";

  await t.test("registration and verified-account duplicate handling", async () => {
    const response = await api.request("/auth/signup", {
      method: "POST",
      body: {
        name: "Original User",
        email: verificationEmail,
        password: originalPassword,
      },
    });
    assert.equal(response.status, 201);
    assert.deepEqual((await readBody(response)).data, {
      id: 1,
      email: verificationEmail,
    });
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
    assert.equal(reRegistration.status, 201);
    assert.equal(api.state.emails.length, 1);
    assert.equal(api.state.users.get(verificationEmail)?.name, "Original User");
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

    const verified = await api.request("/auth/verify-otp", {
      method: "POST",
      body: { email: verificationEmail, otp },
    });
    assert.equal(verified.status, 200);
    assert.equal(
      api.state.users.get(verificationEmail)?.is_verified,
      true,
    );

    const duplicate = await api.request("/auth/signup", {
      method: "POST",
      body: {
        name: "Another User",
        email: verificationEmail,
        password: "OtherPass123!",
      },
    });
    assert.equal(duplicate.status, 409);

    const reusedOtp = await api.request("/auth/verify-otp", {
      method: "POST",
      body: { email: verificationEmail, otp },
    });
    assert.equal(reusedOtp.status, 400);
  });

  await t.test("expired and over-attempt OTPs are rejected", async () => {
    const expiredEmail = "expired@example.com";
    await api.request("/auth/signup", {
      method: "POST",
      body: { name: "Expired User", email: expiredEmail, password: originalPassword },
    });
    const expiredOtp = api.state.emails.at(-1)!.otp;
    api.state.redis.delete(otpKey("verification", expiredEmail));
    const expired = await api.request("/auth/verify-otp", {
      method: "POST",
      body: { email: expiredEmail, otp: expiredOtp },
    });
    assert.equal(expired.status, 400);

    const limitedEmail = "limited@example.com";
    await api.request("/auth/signup", {
      method: "POST",
      body: { name: "Limited User", email: limitedEmail, password: originalPassword },
    });
    const limitedOtp = api.state.emails.at(-1)!.otp;
    const invalidOtp = limitedOtp === "000000" ? "000001" : "000000";
    for (let attempt = 0; attempt < 5; attempt++) {
      const invalid = await api.request("/auth/verify-otp", {
        method: "POST",
        body: { email: limitedEmail, otp: invalidOtp },
      });
      assert.equal(invalid.status, 400);
    }
    const rejectedValidCode = await api.request("/auth/verify-otp", {
      method: "POST",
      body: { email: limitedEmail, otp: limitedOtp },
    });
    assert.equal(rejectedValidCode.status, 400);
  });

  await t.test("password recovery uses a distinct OTP and revokes sessions", async () => {
    const login = await api.request("/auth/signin", {
      method: "POST",
      body: { email: verificationEmail, password: originalPassword },
    });
    assert.equal(login.status, 200);
    const oldSession = responseCookie(login);

    const forgot = await api.request("/auth/forgot-password", {
      method: "POST",
      body: { email: verificationEmail },
    });
    assert.equal(forgot.status, 200);
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

    const reset = await api.request("/auth/reset-password", {
      method: "POST",
      body: {
        email: verificationEmail,
        otp: recovery.otp,
        newPassword: "ResetPass123!",
      },
    });
    assert.equal(reset.status, 200);

    const staleSession = await api.request("/auth/me", { cookie: oldSession });
    assert.equal(staleSession.status, 401);
    const oldPassword = await api.request("/auth/signin", {
      method: "POST",
      body: { email: verificationEmail, password: originalPassword },
    });
    assert.equal(oldPassword.status, 401);
  });

  await t.test("current-user and logout resolve only the cookie's session", async () => {
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

    const aliceMe = await api.request("/auth/me", { cookie: aliceFirstCookie });
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
    assert.equal((await readBody(changed)).message, "Password changed successfully");

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
  });

  await t.test("email and database failures return server errors and permit retry", async () => {
    const retryEmail = "retry@example.com";
    await api.addUser(retryEmail, originalPassword);
    api.state.failEmail = true;
    const failedDelivery = await api.request("/auth/forgot-password", {
      method: "POST",
      body: { email: retryEmail },
    });
    assert.equal(failedDelivery.status, 500);
    assert.equal(
      api.state.redis.has(otpKey("password-reset", retryEmail)),
      false,
    );

    const retry = await api.request("/auth/forgot-password", {
      method: "POST",
      body: { email: retryEmail },
    });
    assert.equal(retry.status, 200);

    api.state.failNextQuery = true;
    const databaseFailure = await api.request("/auth/forgot-password", {
      method: "POST",
      body: { email: "database-error@example.com" },
    });
    assert.equal(databaseFailure.status, 500);
    assert.equal((await readBody(databaseFailure)).message, "Internal server error");
  });
});
