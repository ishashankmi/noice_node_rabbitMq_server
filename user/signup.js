import conn from "../db/connect.js";

const signup = async (
  { username, name, password, country_data, location },
  phone
) => {
  let fname = name.split(" ")[0];
  return new Promise((resolve, reject) => {
    conn.beginTransaction((err) => {
      if (err) {
        conn.rollback();
        reject();
      } else {
        conn.query(
          `INSERT INTO profile(username, password, given_name, first_name, phone, country_data, location) VALUES(?,?,?,?,?,?,?)`,
          [username, password, name, fname, phone, country_data, location],
          (err, result) => {
            if (err) {
              conn.rollback();
              reject();
            } else {
              const id = result.insertId;
              conn.query(
                `INSERT INTO followers_exact(owner_id) VALUES(?)`,
                [id],
                (err, result) => {
                  if (err) {
                    conn.rollback();
                    reject();
                  } else {
                    conn.commit();
                    resolve();
                  }
                }
              );
            }
          }
        );
      }
    });
  });
};

export default signup;
