import "dotenv/config";
import mysql from "mysql";

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "#Hellow90",
  database: "noicefeed",
});

conn.connect((e) => {
  if (e) {
    console.log("[x] Database Failed To Connect\r\n");
  } else {
    console.log("[+] MySql Database Connected\n\r");
  }
});

export default conn;
