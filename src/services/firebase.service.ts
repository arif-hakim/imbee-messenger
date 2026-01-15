import admin from "firebase-admin";
import config from "../config/index.js";

let firebaseApp: admin.app.App | null = null;

export function initializeFirebase(): admin.app.App {
	if (firebaseApp) return firebaseApp;

	if (!config.FIREBASE_PROJECT_ID || !config.FIREBASE_CLIENT_EMAIL || !config.FIREBASE_PRIVATE_KEY) {
		throw new Error("Firebase configuration is incomplete");
	}

	firebaseApp = admin.initializeApp({
		credential: admin.credential.cert({
			projectId: config.FIREBASE_PROJECT_ID,
			clientEmail: config.FIREBASE_CLIENT_EMAIL,
			privateKey: config.FIREBASE_PRIVATE_KEY,
		}),
	});

	console.log("✅ Firebase initialized!");
	return firebaseApp;
}

export interface SendFcmParams {
	deviceId: string;
	text: string;
}

export async function sendFcmNotification(params: SendFcmParams): Promise<string> {
	if (!firebaseApp) {
		throw new Error("Firebase not initialized");
	}

	const message: admin.messaging.Message = {
		topic: params.deviceId,
		notification: {
			title: "Incoming message",
			body: params.text,
		},
	};

	const response = await admin.messaging().send(message);
	return response;
}
