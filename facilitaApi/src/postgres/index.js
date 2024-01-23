import pg from "pg";
import dotenv from "dotenv";

const { Pool } = pg;

dotenv.config();


const user = `${process.env.POSTGRESDB_USER}`;
const host =  `${process.env.POSTGRESDB_HOST}`;
const database =  `${process.env.POSTGRESDB_DATABASE}`;
const password =  `${process.env.POSTGRESDB_ROOT_PASSWORD}`;
const port = `${process.env.POSTGRESDB_LOCAL_PORT}`;

export const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
  });
  