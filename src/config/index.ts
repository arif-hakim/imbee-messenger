import dotenv from "dotenv";
dotenv.config();

import firebaseServiceAccount from "../../firebase-service-account.json" with { type: "json" };

export default {
	NODE_ENV: process.env.NODE_ENV || "development",
	PORT: process.env.PORT || 3000,
	DB_HOST: process.env.DB_HOST || "",
	DB_PORT: (process.env.DB_PORT || 3306) as number,
	DB_NAME: process.env.DB_NAME || "",
	DB_USER: process.env.DB_USER || "",
	DB_PASSWORD: process.env.DB_PASSWORD || "",

	// RabbitMQ
	RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://localhost",
	RABBITMQ_FCM_QUEUE: process.env.RABBITMQ_FCM_QUEUE || "notification.fcm",
	RABBITMQ_DONE_TOPIC: process.env.RABBITMQ_DONE_TOPIC || "notification.done",

	// Firebase
	FIREBASE_PROJECT_ID: firebaseServiceAccount.project_id || "",
	FIREBASE_CLIENT_EMAIL: firebaseServiceAccount.client_email || "",
	FIREBASE_PRIVATE_KEY: firebaseServiceAccount.private_key?.replace(/\\n/g, "\n") || "",
};
