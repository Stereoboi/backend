import { createConnection, DataSourceOptions } from "typeorm";
import { Todo } from "../entities/Todo";
import { User } from "../entities/User";

function getSSLConfig(env: any) {
  const configs: { [key: string]: boolean | { [key: string]: boolean } } = {
    production: { rejectUnauthorized: true },
    local: false,
    deploy: { rejectUnauthorized: false },
  };
  if (!configs[env] === undefined) {
    throw new Error("Set network in your .env file");
  }
  return configs[env];
}

const connectDB = async () => {
  try {
    const options: DataSourceOptions = {
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT_DB),
      logging: ["query", "error"],
      type: "postgres",
      entities: [Todo, User],
      migrations: ["dist/migrations/**/*.{ts,js}"],
      subscribers: ["src/subscriber/**/*.ts"],
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      ssl: true,
      synchronize: true,
    };
    await createConnection(options);
    console.log("Postgress Connected...");
  } catch (err) {
    console.error("Myerror", (err as Error).message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
