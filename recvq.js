import amqplib from "amqplib";

const recv = async () => {
  const connection = await amqplib.connect("amqp://localhost");

  const channel = await connection.createChannel();

  await channel.assertQueue("test", { durable: true });

  channel.consume(
    "test",
    (msg) => {
      if (msg.content) {
        console.log(msg.content.toString());
      }
    },
    {
      noAck: true,
    }
  );
};

recv();
