import { Environment } from "./environment.interface";

export const environment: Environment = {
  NODE_ENV: "production",
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL as string,
};
