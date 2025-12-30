"use client";
import clsx from "clsx";
import Title from "./Title";

interface ContainerProps {
	children: React.ReactNode;
	title?: string;
	className?: string;
	clean?: boolean;
	paddingTop?: boolean;
}

export default function Container({
	children,
	title,
	className,
	clean = false,
	paddingTop = false,
}: ContainerProps) {
	return (
		<div
			className={clsx(
				"mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex flex-col",
				paddingTop ? "pt-24 md:pt-32" : "pt-0"
			)}
		>
			{!clean && title && (
				<div className="flex-shrink-0 mb-4 md:mb-6">
					<Title title={title} />
				</div>
			)}

			<div
				className={clsx(
					"flex-1 overflow-y-auto scroll-content",
					"scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
					className
				)}
			>
				{children}
			</div>
		</div>
	);
}
