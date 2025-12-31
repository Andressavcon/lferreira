"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
	return (
		<motion.div
			initial={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 1, ease: "easeInOut" }}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100dvw",
				height: "100dvh",
				backgroundColor: "#000",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 9999,
			}}
		>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{
					scale: [0.8, 1.1, 0.9],
					opacity: [0, 1, 0.5],
				}}
				transition={{
					duration: 3,
					repeat: Infinity,
					ease: "easeInOut",
				}}
				style={{
					fontSize: "5rem",
					color: "#fff",
					fontFamily: "var(--font-sua-logo)",
					fontWeight: "bold",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Image
					src="/img/logo/lferreira-a.svg"
					alt="A girando"
					width={42}
					height={42}
					// className="spin-a"
					priority
				/>
			</motion.div>
		</motion.div>
	);
}
