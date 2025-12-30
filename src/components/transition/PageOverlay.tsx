"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTransitionNav } from "@/components/transition/TransitionContext";

export default function PageOverlay() {
	const { isTransitioning } = useTransitionNav();

	return (
		<AnimatePresence>
			{isTransitioning && (
				<motion.div
					key="page-overlay"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.25 }}
					className="fixed inset-0 z-[9999] bg-black pointer-events-auto"
					style={{ width: "100vw", height: "100vh" }}
				/>
			)}
		</AnimatePresence>
	);
}
