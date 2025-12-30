"use client";

import clsx from "clsx";

interface SectionProps {
	children: React.ReactNode;
	className?: string;
	full?: boolean;
}

export function Section({ children, className, full = false }: SectionProps) {
	return (
		<section
			className={clsx(
				"relative",
				"py-16 md:py-24 lg:py-32",
				full && "min-h-screen flex flex-col justify-center",
				className
			)}
		>
			{children}
		</section>
	);
}
