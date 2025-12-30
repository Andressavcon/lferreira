"use client";

import clsx from "clsx";
import { motion } from "framer-motion";

interface TitleProps {
	title: string;
	as?: "h1" | "h2";
	align?: "left" | "center";
	className?: string;
}

export default function Title({
	title,
	as = "h1",
	align = "left",
	className,
}: TitleProps) {
	const Heading = as;

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className={clsx(
				"relative z-10 w-full max-w-4xl flex flex-col gap-4",
				align === "center"
					? "mx-auto text-center items-center"
					: "text-left items-start",
				className
			)}
		>
			<Heading className="font-bogle text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
				{title}
			</Heading>

			<div
				className={clsx(
					"h-1 w-12 bg-cyan-500 rounded-full",
					align === "center" ? "mx-auto" : "ml-0"
				)}
			/>
		</motion.div>
	);
}
