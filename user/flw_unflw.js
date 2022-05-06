import conn from "../db/connect.js";

const follow_user = async (id, us_id) => {
  const user_combo = id.toString() + us_id.toString();
  return new Promise((resolve, reject) => {
    conn.getConnection((err, conn) => {
      try {
        if (err) {
          reject();
        } else {
          conn.beginTransaction((err) => {
            if (err) {
              console.log("err.1");
              conn.rollback();
              reject(err.message);
            } else {
              conn.query(
                `INSERT INTO followers(user_id, user_combo, following_id) VALUES(?, ?, ?)`,
                [us_id, user_combo, id],
                (err1, result1) => {
                  if (err) {
                    console.log("err 1.2");
                    conn.rollback();
                    reject(err1.message);
                  } else {
                    conn.query(
                      `UPDATE followers_exact as t1, followers_exact as t2 SET
                            t1.followers = t1.followers + 1,
                            t2.following = t2.following + 1
                            where t1.owner_id = ? AND
                            t2.owner_id = ? `,
                      [id, us_id],
                      (err2, result2) => {
                        if (err2) {
                          console.log(err2.message);
                          conn.rollback();
                          reject(err2.message);
                        } else {
                          conn.commit();
                          resolve({ success: true });
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
      } finally {
        conn.release();
      }
    });
  });
};

const unfollow_user = async (id, us_id) => {
  const user_combo = id.toString() + us_id.toString();
  return new Promise((resolve, reject) => {
    conn.getConnection((err, conn) => {
      try {
        if (err) {
          reject();
        } else {
          conn.beginTransaction((err) => {
            if (err) {
              console.log("err.1");
              conn.rollback();
              reject();
            } else {
              conn.query(
                `DELETE FROM followers WHERE user_combo = ?`,
                [user_combo],
                (err1, result1) => {
                  if (err) {
                    console.log("err 1.2");
                    conn.rollback();
                    reject(err1.message);
                  } else {
                    conn.query(
                      `UPDATE followers_exact as t1, followers_exact as t2 SET
                            t1.followers = t1.followers - 1,
                            t2.following = t2.following - 1 
                            where t1.owner_id = ? AND 
                            t2.owner_id = ? `,
                      [id, us_id],
                      (err2, result2) => {
                        if (err2) {
                          console.log(err2.message);
                          conn.rollback();
                          reject(err2.message);
                        } else {
                          conn.commit();
                          resolve({ success: true });
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
      } finally {
        conn.release();
      }
    });
  });
};

export { follow_user, unfollow_user };
