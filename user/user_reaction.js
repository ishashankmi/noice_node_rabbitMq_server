import conn from "../db/connect.js";

const post_reaction = async (username, user_id, post_id, reaction) => {
  try {
    const reaction_combo = user_id.toString() + post_id.toString();

    return new Promise((resolve, reject) => {
      conn.beginTransaction((err) => {
        if (err) {
          reject({ success: false, err: "err1" });
          conn.rollback();
        } else {
          conn.query(
            "SELECT reaction FROM user_reaction WHERE reaction_combo = ? LIMIT 1",
            [reaction_combo],
            (err, res) => {
              let query;
              const rea = JSON.parse(JSON.stringify(res))[0];
              if (res[0] == undefined) {
                if (reaction == 1) {
                  conn.query(
                    "UPDATE post SET upvotes = upvotes+1 WHERE id = ? LIMIT 1",
                    [post_id],
                    (err, result) => {
                      console.log("ok");
                    }
                  );
                } else {
                  conn.query(
                    "UPDATE post SET downvotes = downvotes + 1 WHERE id = ? LIMIT 1",
                    [post_id],
                    (err, result) => {
                      console.log("ok");
                    }
                  );
                }
              } else {
                if (rea.reaction == 1 && reaction == 2) {
                  conn.query(
                    "UPDATE post SET upvotes = upvotes-1, downvotes = downvotes + 1 WHERE id = ? LIMIT 1",
                    [post_id],
                    (err, result) => {
                      console.log("ok");
                    }
                  );
                }
                if (rea.reaction == 2 && reaction == 1) {
                  console.log("aew");
                  conn.query(
                    "UPDATE post SET upvotes = upvotes+1, downvotes = downvotes - 1 WHERE id = ? LIMIT 1",
                    [post_id],
                    (err, result) => {
                      console.log("ok");
                    }
                  );
                }
              }
              conn.commit();
            }
          );

          conn.query(
            "REPLACE INTO user_reaction(reaction_combo, user_id, post_id, reaction) VALUES(?, ?, ?, ?)",
            [reaction_combo, user_id, post_id, reaction],
            (err, result) => {
              if (err) {
                conn.rollback();
                reject({ success: false, err: "err2" });
              } else {
                conn.commit();
                resolve({ success: true });
              }
            }
          );
        }
      });
    });
  } catch (e) {
    console.log(e.message);
  }
};

const remove_post_reaction = async (username, user_id, post_id) => {
  try {
    return new Promise((resolve, reject) => {
      const reaction_combo = user_id.toString() + post_id.toString();
      conn.beginTransaction((err) => {
        if (err) {
          conn.rollback();
          reject({ success: false, err: "err1" });
        } else {
          conn.query(
            "SELECT reaction FROM user_reaction WHERE reaction_combo = ? LIMIT 1",
            [reaction_combo],
            (err, result) => {
              if (err) {
                conn.rollback();
                reject({ success: false, err: "err1" });
              } else {
                const user_reaction = JSON.parse(JSON.stringify(result))[0];
                let query;
                if (user_reaction.reaction == 1) {
                  query =
                    "UPDATE post SET upvotes = upvotes-1 WHERE id = ? LIMIT 1";
                } else {
                  query =
                    "UPDATE post SET downvotes = downvotes-1 WHERE id = ? LIMIT 1";
                }
                conn.query(query, [post_id], (err, result) => {
                  if (err) {
                    resolve({ success: false, err: "err2" });
                    conn.rollback();
                  } else {
                    conn.query(
                      "DELETE FROM user_reaction WHERE user_id = ? AND reaction_combo = ? AND post_id = ?",
                      [user_id, reaction_combo, post_id]
                    );
                    resolve({ success: true });
                    conn.commit();
                  }
                });
              }
            }
          );
        }
      });
    });
  } catch (e) {
    return { success: false };
  }
};

export { post_reaction, remove_post_reaction };
