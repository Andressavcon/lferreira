"use client";

import { useEffect, useState } from "react";

export type Countdown = {
	total: number;
	hours: number;
	minutes: number;
	seconds: number;
	isDone: boolean;
};

function compute(target: number): Countdown {
	const total = Math.max(0, target - Date.now());
	const hours = Math.floor(total / (1000 * 60 * 60));
	const minutes = Math.floor((total / (1000 * 60)) % 60);
	const seconds = Math.floor((total / 1000) % 60);
	return { total, hours, minutes, seconds, isDone: total <= 0 };
}

export function useCountdown(target: number): Countdown {
	const [state, setState] = useState<Countdown>(() => compute(target));

	useEffect(() => {
		const id = setInterval(() => setState(compute(target)), 1000);

		return () => clearInterval(id);
	}, [target]);

	return state;
}

export function pad(n: number): string {
	return n.toString().padStart(2, "0");
}
