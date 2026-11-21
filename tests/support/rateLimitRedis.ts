import type { RedisReply } from "rate-limit-redis";

interface Counter {
  hits: number;
  expiresAt: number;
}

export const runRateLimitRedisCommand = async (
  commandArgs: readonly unknown[],
  counters: Map<string, Counter>,
): Promise<RedisReply> => {
  const [command, ...args] = commandArgs.map(String);

  if (command === "SCRIPT" && args[0] === "LOAD") {
    return args[1].includes('redis.call("INCR"') ? "increment-script" : "get-script";
  }

  if (command === "EVALSHA") {
    const [script, , key, windowMs] = args;
    const now = Date.now();
    const current = counters.get(key);

    if (script === "increment-script") {
      if (!current || current.expiresAt <= now) {
        const counter = {
          hits: 1,
          expiresAt: now + Number(windowMs),
        };
        counters.set(key, counter);
        return [counter.hits, Number(windowMs)];
      }

      current.hits += 1;
      return [current.hits, current.expiresAt - now];
    }

    if (script === "get-script") {
      if (!current || current.expiresAt <= now) return [false, -2];
      return [current.hits, current.expiresAt - now];
    }
  }

  if (command === "DECR") {
    const counter = counters.get(args[0]);
    if (counter) counter.hits -= 1;
    return counter?.hits ?? 0;
  }

  if (command === "DEL") {
    return counters.delete(args[0]) ? 1 : 0;
  }

  throw new Error(`Unexpected Redis rate-limit command: ${command}`);
};
