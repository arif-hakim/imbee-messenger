import express from "express";
import db from "./db/index.js";
import config from "./config/index.js";
import { connectRabbitMQ, closeRabbitMQ } from "./services/rabbitmq.service.js";
import { initializeFirebase } from "./services/firebase.service.js";
import { startFcmConsumer } from "./services/fcm-consumer.service.js";

const app = express();

app.use(express.json());

const port = config.PORT;

async function startServer() {
	await db.$connect();
	console.log("✅ Database connected!");

	// Initialize Firebase
	initializeFirebase();

	// Connect to RabbitMQ and start consumer
	const channel = await connectRabbitMQ();
	await startFcmConsumer(channel);

	app.listen(port, () => {
		console.log(`✅ Server listening on port ${port}`);
	});
}

startServer().catch((err) => {
	console.error("❌ Failed to start server:", err);
	process.exit(1);
});

// Handle shutdown gracefully
process.on("SIGINT", async () => {
	console.log("❌ Shutting down...");
	await closeRabbitMQ();
	await db.$disconnect();
	process.exit(0);
});
