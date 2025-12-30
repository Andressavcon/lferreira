/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "../ui";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
	const [isVisible, setIsVisible] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const toggleVisibility = (event: any) => {
			const target = event.target;

			if (target instanceof HTMLElement) {
				const scrollTop = target.scrollTop || 0;
				setIsVisible(scrollTop > 200);
			}
		};

		window.addEventListener("scroll", toggleVisibility, true);

		return () => {
			window.removeEventListener("scroll", toggleVisibility, true);
		};
	}, [pathname]);

	const scrollToTop = () => {
		const config = { top: 0, behavior: "smooth" as ScrollBehavior };

		window.scrollTo(config);

		const scrollables = document.querySelectorAll(
			".scroll-content, [class*='overflow-y-auto']"
		);
		scrollables.forEach((el) => {
			el.scrollTo(config);
		});
	};

	return (
		<div
			className={`fixed bottom-8 right-8 z-[100] transition-all duration-500 ${
				isVisible
					? "opacity-100 translate-y-0"
					: "opacity-0 translate-y-10 pointer-events-none"
			}`}
		>
			<Button
				variant="ghost"
				size="icon"
				onClick={scrollToTop}
				className="h-12 w-12 rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-md hover:bg-white/10 transition-all group shadow-2xl"
			>
				<ChevronUp
					className="group-hover:-translate-y-1 transition-transform"
					size={28}
				/>
			</Button>
		</div>
	);
}
