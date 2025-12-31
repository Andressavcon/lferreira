"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import NextImage from "next/image";

import { usePageLoader } from "@/hooks/usePageLoader";
import BackgroundImage from "../layout/BackgroundImage";
import Container from "../layout/Container";
import LoadingScreen from "../layout/LoadingScreen";
import PageWrapper from "@/components/transition/PageWrapper";

export default function Shop() {
	const t = useTranslations("notFound");
	const tShop = useTranslations("shop");
	const bgImage = "/img/gallery/8.jpg";

	const loading = usePageLoader(bgImage);

	return (
		<PageWrapper>
			<AnimatePresence mode="wait">
				{loading && <LoadingScreen key="loader-shop" />}
			</AnimatePresence>

			<main
				style={{
					opacity: loading ? 0 : 1,
					transition: "opacity 1.5s ease-in-out",
				}}
				className="relative h-screen overflow-hidden"
			>
				<BackgroundImage
					src={bgImage}
					imageOpacity={0.4}
					overlayOpacity={0.7}
				/>
				<Container
					title={tShop("title")}
					paddingTop={true}
					className="overflow-y-auto custom-scrollbar"
				>
					<div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] w-full">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="bg-black/20 backdrop-blur-md border border-white/5 p-12 md:p-20 rounded-3xl flex flex-col items-center text-center max-w-3xl"
						>
							<div className="flex items-center gap-2 mb-10">
								<NextImage
									src="/img/logo/lferreira-base.svg"
									alt="LFerreira"
									width={220}
									height={60}
									priority
									className="opacity-90"
								/>
								<NextImage
									src="/img/logo/lferreira-a.svg"
									alt="A girando"
									width={38}
									height={38}
									className="spin-a"
									priority
								/>
							</div>

							<div className="space-y-6">
								<h1 className="text-2xl md:text-3xl font-extralight tracking-[0.25em] text-white leading-relaxed">
									{tShop("description")}
								</h1>
							</div>

							<Link
								href="/"
								className="mt-16 group relative overflow-hidden px-8 py-3 transition-all"
							>
								<span className="relative z-10 text-[10px] uppercase tracking-[0.5em] text-neutral-400 group-hover:text-white transition-colors duration-300">
									{t("message3")}
								</span>
								<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-cyan-400 transition-all duration-300 group-hover:w-full" />
							</Link>
						</motion.div>
					</div>
				</Container>
			</main>
		</PageWrapper>
	);
}
