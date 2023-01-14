import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "postgres",
  synchronize: true, // 운영환경에서는 false 해주기
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrations: [],
  subscribers: [],
});
