import "dotenv/config";
import { createPool } from "mysql";

const conn = createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "toor",
  database: "noicefeed",
  charset: "utf8mb4",
});

export default conn;
