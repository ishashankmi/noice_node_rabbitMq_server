import "dotenv/config";
import { createPool } from "mysql";

const conn = createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "#Hellow90",
  database: "noicefeed",
});

export default conn;
