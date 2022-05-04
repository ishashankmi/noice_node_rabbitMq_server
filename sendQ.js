import amqplib from "amqplib";
import { v4 as uuidv4 } from "uuid";

const uid = uuidv4();

const sendQ = async () => {
  const connnection = await amqplib.connect("amqp://localhost");
  const channel = await connnection.createChannel();

  await channel.assertQueue("follow_user", { durable: true });
  const follow_queue = await channel.assertQueue("", { exclusive: true });

  channel.sendToQueue(
    "follow_user",
    Buffer.from(JSON.stringify({ id: 44, user_id: 10 })),
    {
      replyTo: follow_queue.queue,
      correlationId: uid,
    }
  );

  console.log("[~] Msg Sent ");

  channel.consume(
    follow_queue.queue,
    (msg) => {
      if (msg.properties.correlationId == uid) {
        const data = JSON.parse(msg.content.toString());
        console.log(data["success"]);
        channel.close();
        connnection.close();
      }
    },
    {
      noAck: true,
    }
  );
};

try {
  sendQ();
} catch (e) {
  console.log(e.message);
}
