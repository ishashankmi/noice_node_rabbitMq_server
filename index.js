import amqplib from "amqplib";
import { follow_user, unfollow_user } from "./user/flw_unflw.js";
import { post_reaction, remove_post_reaction } from "./user/user_reaction.js";
import signup from "./user/signup.js";
import displayEdit from "./user/displayEdit.js";

console.clear();

const ProceedQ = async () => {
  try {
    const connnection = await amqplib.connect("amqp://localhost");
    console.log("[~] RabbitMQ Connected\r\n");
    const channel = await connnection.createChannel();

    // --------------------- FOLLOW QUEUE ------------------------

    await channel.assertQueue("follow_user", { durable: true });
    channel.prefetch(1);
    channel.consume(
      "follow_user",
      (msg) => {
        if (msg.content) {
          const returnData = msg.properties;
          const replyTo = returnData.replyTo;
          const coId = returnData.correlationId;
          console.log(msg.content.toString());
          const mainData = JSON.parse(msg.content.toString());
          const { id, user_id } = mainData;

          follow_user(id, user_id)
            .then((e) => {
              channel.ack(msg);
              channel.sendToQueue(
                replyTo,
                Buffer.from(JSON.stringify({ success: true })),
                {
                  correlationId: coId,
                }
              );
            })
            .catch((e) => {
              channel.sendToQueue(
                replyTo,
                Buffer.from(JSON.stringify({ success: false })),
                {
                  correlationId: coId,
                }
              );
            });
        }
      },
      {
        noAck: false,
      }
    );

    // --------------------- UNFOLLOW QUEUE ------------------------

    await channel.assertQueue("unfollow_user", { durable: true });
    channel.consume(
      "unfollow_user",
      (msg) => {
        if (msg.content) {
          const returnData = msg.properties;
          const replyTo = returnData.replyTo;
          const coId = returnData.correlationId;
          console.log(msg.content.toString());
          const mainData = JSON.parse(msg.content.toString());
          const { id, user_id } = mainData;

          unfollow_user(id, user_id)
            .then((e) => {
              channel.ack(msg);
              channel.sendToQueue(
                replyTo,
                Buffer.from(JSON.stringify({ success: true })),
                {
                  correlationId: coId,
                }
              );
            })
            .catch((e) => {
              channel.sendToQueue(
                replyTo,
                Buffer.from(JSON.stringify({ success: false })),
                {
                  correlationId: coId,
                }
              );
            });
        }
      },
      {
        noAck: false,
      }
    );

    // --------------------- USER REACTION ------------------------

    // channel.deleteQueue("post_upvote");
    // channel.deleteQueue("post_downvote");
    await channel.assertQueue("post_upvote", { durable: false });

    channel.consume(
      "post_upvote",
      (msg) => {
        if (msg.content) {
          const replyData = msg.properties;
          const replyTo = replyData.replyTo;
          const coId = replyData.correlationId;

          const data = JSON.parse(msg.content.toString());

          const { username, user_id, post_id, reaction } = data;
          console.log(username, user_id, post_id);

          post_reaction(username, user_id, post_id, 1).then((e) => {
            console.log(e);
            channel.sendToQueue(replyTo, Buffer.from("1"), {
              correlationId: coId,
            });
            channel.ack(msg);
          });
        }
      },
      {
        noAck: false,
      }
    );

    await channel.assertQueue("post_downvote", { durable: false });
    channel.consume(
      "post_downvote",
      (msg) => {
        if (msg.content) {
          const replyData = msg.properties;
          const replyTo = replyData.replyTo;
          const coId = replyData.correlationId;

          const data = JSON.parse(msg.content.toString());

          const { username, user_id, post_id } = data;
          console.log(username, user_id, post_id);

          post_reaction(username, user_id, post_id, 2).then((e) => {
            console.log(e);
            channel.sendToQueue(replyTo, Buffer.from("1"), {
              correlationId: coId,
            });
            channel.ack(msg);
          });
        }
      },
      {
        noAck: false,
      }
    );

    const removePostVote = "remove_post_vote";
    await channel.assertQueue(removePostVote, { durable: false });

    channel.consume(
      removePostVote,
      (msg) => {
        if (msg.content) {
          const replyData = msg.properties;
          const replyTo = replyData.replyTo;
          const coId = replyData.correlationId;

          const data = JSON.parse(msg.content.toString());

          const { username, user_id, post_id } = data;
          remove_post_reaction(username, user_id, post_id).then((e) => {
            channel.sendToQueue(replyTo, Buffer.from("1"), {
              correlationId: coId,
            });
            channel.ack(msg);
          });
        }
      },
      {
        noAck: false,
      }
    );

    // --------------------- SIGNUP ------------------------
    const signup_queue = "signup_queue";

    await channel.assertQueue(signup_queue, { durable: true });
    channel.consume(
      signup_queue,
      (msg) => {
        const data = msg.properties;
        const replyTo = data.replyTo;
        const coId = data.correlationId;
        const recv = JSON.parse(msg.content.toString());

        const { user, phone } = recv;

        // channel.sendToQueue(replyTo, Buffer.from("0".toString()), {
        //   correlationId: coId,
        // });

        signup(user, phone)
          .then((e) => {
            channel.sendToQueue(replyTo, Buffer.from("1".toString()), {
              correlationId: coId,
            });
          })
          .catch((e) => {
            channel.sendToQueue(replyTo, Buffer.from("0".toString()), {
              correlationId: coId,
            });
          });
      },
      {
        noAck: true,
      }
    );

    // --------------------- PROFILE DISPLAY EDIT ------------------------

    const editProfileDisplay = "editProfileDisplay";
    await channel.assertQueue("editProfileDisplay", { durable: false });
    channel.consume(
      "editProfileDisplay",
      (msg) => {
        if (msg.content) {
          const replyData = msg.properties;
          const replyTo = replyData.replyTo;
          const coId = replyData.correlationId;

          const { userId, username, bio, location, link } = JSON.parse(
            msg.content.toString()
          );

          displayEdit(userId, username, bio, location, JSON.stringify(link))
            .then((e) => {
              console.log(e);
              channel.sendToQueue(replyTo, Buffer.from("1".toString()), {
                correlationId: coId,
              });
            })
            .catch((e) => {
              console.log(e);
              channel.sendToQueue(replyTo, Buffer.from("0".toString()), {
                correlationId: coId,
              });
            });
        }
      },
      {
        noAck: true,
      }
    );
  } catch (e) {
    console.log("[x] RabbitMQ Failed to Connect, Waiting to Reconnect...\n\r");
  }
};

ProceedQ();
