# Node.js RabbitMQ

A Node.js project showcasing how to use RabbitMQ for message queuing and communication between microservices.

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js (version X.X.X)
- RabbitMQ (version X.X.X)

## Getting Started

Follow the steps below to set up and run the project locally.

1. Clone the repository:

   ```shell
   git clone https://github.com/x3sammy/noice_node_rabbitMq_server.git
   ```

2. Navigate to the project directory:

   ```shell
   cd nodejs-rabbitmq
   ```

3. Install dependencies:

   ```shell
   npm install
   ```

4. Start the RabbitMQ server:

   ```shell
   rabbitmq-server
   ```

5. Run the consumer:

   ```shell
   npm run consumer
   ```

   This will start the consumer service, which listens for messages from the RabbitMQ queue.

6. Run the producer:

   ```shell
   npm run producer
   ```

   This will start the producer service, which sends messages to the RabbitMQ queue.

## Usage

- The consumer service listens for messages from the RabbitMQ queue and processes them accordingly. You can modify the consumer logic in the `consumer.js` file.

- The producer service sends messages to the RabbitMQ queue. You can modify the producer logic in the `producer.js` file.

Feel free to explore and modify this project to fit your specific requirements. Happy messaging with RabbitMQ!
