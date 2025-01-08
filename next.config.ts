import type { NextConfig } from "next";
import dotenv from "dotenv";

dotenv.config();

const nextConfig: NextConfig = {
  env: {
    MONGO_URI: process.env.MONGO_URI,
    REDIS_URI: process.env.REDIS_URI,
    DB_NAME: process.env.DB_NAME,
    PORT: process.env.PORT,
  }
};

export default nextConfig;
