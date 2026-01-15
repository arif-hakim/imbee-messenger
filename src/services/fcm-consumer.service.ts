import config from "../config/index.js";
import { sendFcmNotification } from "./firebase.service.js";
import { publishToDoneTopic, connectRabbitMQ } from "./rabbitmq.service.js";
import { fcmJobRepository } from "../repositories/fcm-job.repository.js";

type AmqpChannel = Awaited<ReturnType<typeof connectRabbitMQ>>;

export interface FcmMessage {
	identifier: string;
	type: string;
	deviceId: string;
	text: string;
}

function isValidFcmMessage(data: unknown): data is FcmMessage {
	if (typeof data !== "object" || data === null) return false;

	const msg = data as Record<string, unknown>;
	return (
		typeof msg.identifier === "string" &&
		typeof msg.type === "string" &&
		typeof msg.deviceId === "string" &&
		typeof msg.text === "string"
	);
}

export async function startFcmConsumer(channel: AmqpChannel): Promise<void> {
	console.log(`✅ FCM Consumer started, listening on queue: ${config.RABBITMQ_FCM_QUEUE}`);

	await channel.consume(
		config.RABBITMQ_FCM_QUEUE,
		async (msg) => {
			if (!msg) return;

			let parsedMessage: unknown;
			try {
				parsedMessage = JSON.parse(msg.content.toString());
			} catch (err) {
				console.error("❌ Failed to parse message:", err);
				// Reject malformed message without requeue
				channel.nack(msg, false, false);
				return;
			}

			// Validate message structure
			if (!isValidFcmMessage(parsedMessage)) {
				console.error("❌ Invalid message format:", parsedMessage);
				// Reject invalid message without requeue
				channel.nack(msg, false, false);
				return;
			}

			// Acknowledge immediately after successful decode and validation
			channel.ack(msg);

			const fcmMessage = parsedMessage;
			console.log(`📨 Processing FCM message: ${fcmMessage.identifier}`);

			try {
				// Send FCM notification
				await sendFcmNotification({
					deviceId: fcmMessage.deviceId,
					text: fcmMessage.text,
				});

				const deliverAt = new Date();

				// Save to database
				const isExist = await fcmJobRepository.findByIdentifier(fcmMessage.identifier);
				if (isExist) {
					console.log(`❌ FCM message identifier already sent: ${fcmMessage.identifier}`);
					return;
				}
				await fcmJobRepository.create({
					identifier: fcmMessage.identifier,
					type: fcmMessage.type,
					deviceId: fcmMessage.deviceId,
					text: fcmMessage.text,
					deliverAt,
				});

				// Publish to notification.done topic
				await publishToDoneTopic({
					identifier: fcmMessage.identifier,
					deliverAt: deliverAt.toISOString(),
				});

				console.log(`✅ FCM message processed successfully: ${fcmMessage.identifier}`);
			} catch (err) {
				console.error(`❌ Failed to process FCM message ${fcmMessage.identifier}:`, err);
			}
		},
		{ noAck: false }
	);
}
