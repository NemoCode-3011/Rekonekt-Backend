import { RedisStore } from "rate-limit-redis";
import type {
  ClientRateLimitInfo,
  IncrementResponse,
  Options as RateLimitOptions,
  Store,
} from "express-rate-limit";
import { redisClient } from "../config/redis";

export class RateLimitStoreUnavailableError extends Error {
  readonly code = "RATE_LIMIT_STORE_UNAVAILABLE";

  constructor(readonly originalError?: unknown) {
    super("Rate limit store is unavailable");
    this.name = "RateLimitStoreUnavailableError";
  }
}

class SharedRedisStore extends RedisStore {
  async increment(key: string): Promise<IncrementResponse> {
    try {
      return await super.increment(key);
    } catch (error) {
      throw new RateLimitStoreUnavailableError(error);
    }
  }

  async decrement(key: string): Promise<void> {
    try {
      await super.decrement(key);
    } catch (error) {
      throw new RateLimitStoreUnavailableError(error);
    }
  }

  async resetKey(key: string): Promise<void> {
    try {
      await super.resetKey(key);
    } catch (error) {
      throw new RateLimitStoreUnavailableError(error);
    }
  }

  async get(key: string): Promise<ClientRateLimitInfo | undefined> {
    try {
      return await super.get(key);
    } catch (error) {
      throw new RateLimitStoreUnavailableError(error);
    }
  }
}

class DeferredRedisStore implements Store {
  private readonly store: SharedRedisStore;
  private options?: RateLimitOptions;
  private initialization?: Promise<void>;

  constructor(prefix: string) {
    this.store = new SharedRedisStore({
      prefix,
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    });
  }

  init(options: RateLimitOptions) {
    this.options = options;
  }

  private async initialize() {
    if (!this.options) throw new RateLimitStoreUnavailableError();

    if (!this.initialization) {
      this.initialization = this.store.init(this.options).catch((error) => {
        this.initialization = undefined;
        throw new RateLimitStoreUnavailableError(error);
      });
    }

    await this.initialization;
  }

  async increment(key: string): Promise<IncrementResponse> {
    await this.initialize();
    return this.store.increment(key);
  }

  async decrement(key: string): Promise<void> {
    await this.initialize();
    await this.store.decrement(key);
  }

  async resetKey(key: string): Promise<void> {
    await this.initialize();
    await this.store.resetKey(key);
  }

  async get(key: string): Promise<ClientRateLimitInfo | undefined> {
    await this.initialize();
    return this.store.get(key);
  }
}

export const createRedisRateLimitStore = (prefix: string): Store =>
  new DeferredRedisStore(prefix);
