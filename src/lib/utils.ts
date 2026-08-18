import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatVideoDate = (
	monthKeys: { [key: string]: string },
	dateStr: string,
	t: (key: string) => string,
) => {
	const [month, year] = dateStr.split(".");
	const monthKey = monthKeys[month];

	return `${t(`month.${monthKey}`)} ${year}`;
};

export const worldCup2026Round32: {
	nome: string;
	label: string;
	iso: string;
}[] = [
	{ nome: "africa_do_sul", label: "África do Sul", iso: "za" },
	{ nome: "canada", label: "Canadá", iso: "ca" },
	{ nome: "brasil", label: "Brasil", iso: "br" },
	{ nome: "japao", label: "Japão", iso: "jp" },
	{ nome: "alemanha", label: "Alemanha", iso: "de" },
	{ nome: "paraguai", label: "Paraguai", iso: "py" },
	{ nome: "holanda", label: "Holanda", iso: "nl" },
	{ nome: "marrocos", label: "Marrocos", iso: "ma" },
	{ nome: "costa_do_marfim", label: "Costa do Marfim", iso: "ci" },
	{ nome: "noruega", label: "Noruega", iso: "no" },
	{ nome: "franca", label: "França", iso: "fr" },
	{ nome: "suecia", label: "Suécia", iso: "se" },
	{ nome: "mexico", label: "México", iso: "mx" },
	{ nome: "equador", label: "Equador", iso: "ec" },
	{ nome: "inglaterra", label: "Inglaterra", iso: "gb-eng" },
	{ nome: "rd_congo", label: "RD Congo", iso: "cd" },
	{ nome: "belgica", label: "Bélgica", iso: "be" },
	{ nome: "senegal", label: "Senegal", iso: "sn" },
	{ nome: "estados_unidos", label: "Estados Unidos", iso: "us" },
	{ nome: "bosnia", label: "Bósnia", iso: "ba" },
	{ nome: "espanha", label: "Espanha", iso: "es" },
	{ nome: "austria", label: "Áustria", iso: "at" },
	{ nome: "portugal", label: "Portugal", iso: "pt" },
	{ nome: "croacia", label: "Croácia", iso: "hr" },
	{ nome: "suica", label: "Suíça", iso: "ch" },
	{ nome: "argelia", label: "Argélia", iso: "dz" },
	{ nome: "australia", label: "Austrália", iso: "au" },
	{ nome: "egito", label: "Egito", iso: "eg" },
	{ nome: "argentina", label: "Argentina", iso: "ar" },
	{ nome: "cabo_verde", label: "Cabo Verde", iso: "cv" },
	{ nome: "colombia", label: "Colômbia", iso: "co" },
	{ nome: "gana", label: "Gana", iso: "gh" },
];

export function getCountryLabel(nome: string): string {
	return worldCup2026Round32.find((c) => c.nome === nome)?.label ?? nome;
}

export function getCountryIso(nome: string): string | null {
	return worldCup2026Round32.find((c) => c.nome === nome)?.iso ?? null;
}

export function formatPhone(value: string) {
	const digits = value.replace(/\D/g, "").slice(0, 11);

	if (digits.length <= 2) return digits ? `(${digits}` : "";
	if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
	if (digits.length <= 10)
		return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

	return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function formatInstagram(value: string) {
    const cleanValue = value.replace(/\s+/g, "").replace(/^@+/, "");
    return cleanValue ? `@${cleanValue}` : "";
}