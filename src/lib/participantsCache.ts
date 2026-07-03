import { Participant } from "./type";
import { sweepstakesApi } from "./api";

let cachedParticipants: Participant[] | null = null;
let inFlightRequest: Promise<Participant[]> | null = null;

export function prefetchParticipants(): Promise<Participant[]> {
	if (cachedParticipants) return Promise.resolve(cachedParticipants);

	if (!inFlightRequest) {
		inFlightRequest = sweepstakesApi
			.getParticipants()
			.then((participants) => {
				cachedParticipants = participants;
				inFlightRequest = null;
				return participants;
			})
			.catch((err) => {
				inFlightRequest = null;
				throw err;
			});
	}

	return inFlightRequest;
}

export function getCachedParticipants(): Participant[] | null {
	return cachedParticipants;
}

export function findParticipantByEmail(email: string): Participant | undefined {
	if (!cachedParticipants) return undefined;
	const target = email.trim().toLowerCase();
	return cachedParticipants.find(
		(p) => String(p.email).toLowerCase() === target,
	);
}

export function addCachedParticipant(participant: Participant) {
	if (!cachedParticipants) {
		cachedParticipants = [participant];
		return;
	}
	const alreadyThere = cachedParticipants.some(
		(p) => String(p.email).toLowerCase() === String(participant.email).toLowerCase(),
	);
	if (!alreadyThere) {
		cachedParticipants = [...cachedParticipants, participant];
	}
}

export function clearParticipantsCache() {
	cachedParticipants = null;
	inFlightRequest = null;
}

export function findParticipantByHandle(handle: string): Participant | undefined {
    if (!cachedParticipants) return undefined;
    const target = handle.trim().toLowerCase();
    return cachedParticipants.find(
        (p) => String(p.name).toLowerCase() === target,
    );
}