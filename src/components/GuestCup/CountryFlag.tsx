import { getCountryIso } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function CountryFlag({
	nome,
	className,
}: {
	nome: string;
	className?: string;
}) {
	const iso = getCountryIso(nome);

	if (!iso) {
		return (
			<span
				className={cn(
					"inline-block bg-neutral-800 rounded-sm",
					className,
				)}
				aria-hidden="true"
			/>
		);
	}

	return (
		<span
			className={cn(`fi fi-${iso} rounded-sm`, className)}
			aria-hidden="true"
		/>
	);
}