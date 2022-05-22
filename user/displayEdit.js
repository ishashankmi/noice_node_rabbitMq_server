import conn from "../db/connect.js";

const displayEdit = async (userId, username, bio, location, link) => {
  //   console.log(userId, username, bio, location, link);
  return new Promise((resolve, reject) => {
    try {
      conn.query(
        `UPDATE profile SET bio = ? , location = ?, link = ? 
                    WHERE username = ? AND id = ? LIMIT 1`,
        [bio, location, link, username, userId],
        (err, res) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        }
      );
    } catch (e) {
      reject();
    } finally {
      conn.release();
    }
  });
};

export default displayEdit;
