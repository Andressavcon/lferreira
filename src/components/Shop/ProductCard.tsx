"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import InterestModal from "./InterestModal";

export default function ProductCard() {
	const t = useTranslations("shop");
	const [modalOpen, setModalOpen] = useState(false);

	const videoSrc = "/video/moletom-lferreira.mp4";

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className="bg-black/30 backdrop-blur-md border border-white/10 p-4 md:p-5 rounded-2xl flex flex-col md:flex-row items-center md:items-stretch gap-6 max-w-xl w-full text-left"
			>
				<div className="relative w-full md:w-44 aspect-[4/5] rounded-xl overflow-hidden shrink-0">
					<video
						src={videoSrc}
						autoPlay
						muted
						loop
						playsInline
						className="w-full h-full object-cover"
					/>
					<span className="absolute top-2 right-2 text-[9px] uppercase tracking-widest text-cyan-400 border border-cyan-400/60 rounded-full px-2 py-0.5 bg-black/50 backdrop-blur-sm">
						{t("badge")}
					</span>
				</div>

				<div className="flex flex-col justify-between items-start w-full py-1">
					<div>
						<h1 className="text-lg font-light tracking-[0.15em] text-white uppercase">
							{t("productName")}
						</h1>

						<p className="mt-2 text-xs text-neutral-400 tracking-wide leading-relaxed">
							{t("productDescription")}
						</p>
					</div>

					<button
						onClick={() => setModalOpen(true)}
						className="mt-6 md:mt-0 group relative overflow-hidden py-2 px-4 border border-white/10 hover:border-cyan-400/50 rounded-lg transition-all duration-300"
					>
						<span className="relative z-10 text-[10px] uppercase tracking-[0.3em] text-neutral-300 group-hover:text-cyan-400 transition-colors duration-300">
							{t("ctaButton")}
						</span>
					</button>
				</div>
			</motion.div>

			<InterestModal
				open={modalOpen}
				onOpenChange={setModalOpen}
				product={t("productName")}
				videoUrl={videoSrc}
			/>
		</>
	);
}
