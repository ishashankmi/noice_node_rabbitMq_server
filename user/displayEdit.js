import conn from "../db/connect.js";

const displayEdit = async (userId, username, bio, location, link) => {
  //   console.log(userId, username, bio, location, link);

  return new Promise((resolve, reject) => {
    try {
      conn.query(
        `UPDATE profile SET bio = ? , location = ?, link = ${
          link == "null" ? "NULL" : JSON.stringify(link)
        } 
        WHERE username = ? AND id = ? LIMIT 1`,
        [bio, location, username, userId],
        (err, res) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        }
      );
    } catch (e) {
      console.log("displayEdit.js", e.message);
      reject();
    }
  });
};

export default displayEdit;
