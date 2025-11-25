import { createClient } from "redis";

const redis = createClient({
  url: "redis://localhost:6379"
});

redis.on("error", (err) => console.log("Redis Error:", err));

export async function initRedis() {
  if (!redis.isOpen) {
    await redis.connect();
    console.log("Redis connected");
  }
}

export default redis;