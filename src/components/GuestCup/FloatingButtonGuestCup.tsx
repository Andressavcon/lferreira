"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface FloatingButtonGuestCupProps {
	href: string;
	label?: string;
	openInNewTab?: boolean;
}

export default function FloatingButtonGuestCup({
	href,
	label = "Guest Cup",
	openInNewTab = false,
}: FloatingButtonGuestCupProps) {
	return (
		<Link
			href={href}
			target={openInNewTab ? "_blank" : "_self"}
			rel={openInNewTab ? "noopener noreferrer" : undefined}
			aria-label={label}
			title={label}
			className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 block"
		>
			<motion.div
				className="relative"
				animate={{
					y: [0, 0, -10, 0, -5, 0, 0],
					rotate: [0, 0, -8, 8, -4, 0, 0],
					scale: [1, 1, 1.08, 1, 1.04, 1, 1],
				}}
				transition={{
					duration: 1.4,
					times: [0, 0.15, 0.35, 0.55, 0.7, 0.85, 1],
					repeat: Infinity,
					repeatDelay: 4.5,
					ease: "easeInOut",
				}}
				whileHover={{ y: -4, transition: { duration: 0.2 } }}
			>
				<motion.span
					className="absolute -top-0.5 -right-0.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[9px] font-bold text-black shadow-md select-none"
					animate={{ scale: [1, 1.25, 1] }}
					transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
				>
					!
				</motion.span>

				<div
					className="
						flex items-center justify-center
						w-14 h-14 sm:w-16 sm:h-16
						rounded-full
						border-2 border-cyan-400/10
						bg-neutral-950/95
						shadow-[0_6px_20px_rgba(0,0,0,0.5)]
						transition-shadow duration-300
						hover:border-cyan-300/40
						hover:shadow-[0_6px_20px_rgba(0,0,0,0.55),0_0_14px_rgba(34,211,238,0.3)]
					"
				>
					<Image
						src="/img/foot-ball.png"
						alt=""
						width={40}
						height={40}
						className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
						priority
					/>
				</div>
			</motion.div>
		</Link>
	);
}
