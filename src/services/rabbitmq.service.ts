import amqp from "amqplib";
import config from "../config/index.js";

type AmqpConnection = Awaited<ReturnType<typeof amqp.connect>>;
type AmqpChannel = Awaited<ReturnType<AmqpConnection["createChannel"]>>;

let connection: AmqpConnection | null = null;
let channel: AmqpChannel | null = null;

export async function connectRabbitMQ(): Promise<AmqpChannel> {
	if (channel) return channel;

	connection = await amqp.connect(config.RABBITMQ_URL);
	channel = await connection.createChannel();

	// Assert the queue exists
	await channel.assertQueue(config.RABBITMQ_FCM_QUEUE, { durable: true });

	// Assert the exchange for the done topic
	await channel.assertExchange(config.RABBITMQ_DONE_TOPIC, "fanout", {
		durable: true,
	});

	console.log("✅ RabbitMQ connected!");
	return channel;
}

export async function publishToDoneTopic(message: object): Promise<void> {
	if (!channel) {
		throw new Error("RabbitMQ channel not initialized");
	}

	channel.publish(
		config.RABBITMQ_DONE_TOPIC,
		"",
		Buffer.from(JSON.stringify(message)),
		{ persistent: true }
	);
}

export async function closeRabbitMQ(): Promise<void> {
	if (channel) {
		await channel.close();
		channel = null;
	}
	if (connection) {
		await connection.close();
		connection = null;
	}
}

export function getChannel(): AmqpChannel | null {
	return channel;
}
