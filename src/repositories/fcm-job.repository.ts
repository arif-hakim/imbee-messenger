import db from "../db/index.js";

export interface CreateFcmJobPayload {
	identifier: string;
	type: string;
	deviceId: string;
	text: string;
	deliverAt: Date;
}

export const fcmJobRepository = {
	async create(payload: CreateFcmJobPayload) {
		return db.fcmJob.create({
			data: {
				identifier: payload.identifier,
				type: payload.type,
				deviceId: payload.deviceId,
				text: payload.text,
				deliverAt: payload.deliverAt,
			},
		});
	},

	async findByIdentifier(identifier: string) {
		return db.fcmJob.findUnique({
			where: { identifier },
		});
	},

	async updateDeliverAt(identifier: string, deliverAt: Date) {
		return db.fcmJob.update({
			where: { identifier },
			data: { deliverAt },
		});
	},
};
