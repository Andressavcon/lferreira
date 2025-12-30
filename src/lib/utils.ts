import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatVideoDate = (
	monthKeys: { [key: string]: string },
	dateStr: string,
	t: (key: string) => string
) => {
	const [month, year] = dateStr.split(".");
	const monthKey = monthKeys[month];

	return `${t(`month.${monthKey}`)} ${year}`;
};
