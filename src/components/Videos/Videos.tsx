"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "../layout/Container";
import BackgroundImage from "../layout/BackgroundImage";
import { videos } from "./VideosData";
import { useTranslations } from "next-intl";
import { formatVideoDate } from "@/lib/utils";
import PageWrapper from "@/components/transition/PageWrapper";

export default function VideosPage() {
	const t = useTranslations("videos");
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState(0);
	const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

	const monthKeys: { [key: string]: string } = {
		"01": "january",
		"02": "february",
		"03": "march",
		"04": "april",
		"05": "may",
		"06": "june",
		"07": "july",
		"08": "august",
		"09": "september",
		"10": "october",
		"11": "november",
		"12": "december",
	};

	const handlePrevious = () => {
		setDirection(-1);
		setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setDirection(1);
		setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
	};

	const getVisibleVideos = () => {
		const prev = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
		const next = currentIndex === videos.length - 1 ? 0 : currentIndex + 1;
		return { prev, current: currentIndex, next };
	};

	const visible = getVisibleVideos();

	const getEmbedUrl = (url: string) => {
		const videoId = url.split("v=")[1]?.split("&")[0];
		return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
	};

	return (
		<PageWrapper>
			<main className="relative h-screen overflow-hidden">
				<BackgroundImage
					src="/img/KJ-240.jpeg"
					imageOpacity={0.3}
					overlayOpacity={0.8}
				/>

				<Container
					title={t("title")}
					paddingTop={true}
					className="overflow-y-auto custom-scrollbar"
				>
					<div className="relative z-10 flex flex-col items-center justify-center min-h-[65vh] ">
						{/* Container Principal do Carrossel */}
						<div className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
							{/* CONTAINER DO CARROSSEL (Desktop) */}
							<div className="relative w-full h-[300px] md:h-[500px] flex items-center justify-center overflow-visible">
								{/* PREVIEW ESQUERDA  */}
								<motion.div
									key={`prev-bg-${visible.prev}`}
									initial={{ opacity: 0, x: -100 }}
									animate={{ opacity: 0.45, x: "-120%", scale: 0.75 }}
									transition={{ duration: 0.5 }}
									className="hidden xl:block absolute left-1/2 z-0 pointer-events-none"
								>
									<div className="relative w-[450px] aspect-video rounded-2xl overflow-hidden grayscale-[60%] border border-white/10">
										<Image
											src={videos[visible.prev].thumbnail}
											alt=""
											fill
											className="object-cover"
										/>
									</div>
								</motion.div>

								{/* CONTAINER VÍDEO CENTRAL + SETAS */}
								<div className="relative z-20 w-full max-w-4xl px-4">
									{/* SETA ESQUERDA (Desktop) */}
									<Button
										variant="ghost"
										size="icon"
										onClick={handlePrevious}
										className="hidden md:flex absolute -left-6 lg:-left-24 top-1/2 -translate-y-1/2 z-50 h-14 w-14 rounded-full bg-black/50 hover:bg-white/10 text-white backdrop-blur-md border border-white/10 transition-all"
									>
										<ChevronLeft size={32} />
									</Button>

									{/* PLAYER CENTRAL */}
									<AnimatePresence mode="wait" custom={direction}>
										<motion.div
											key={currentIndex}
											custom={direction}
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.95 }}
											transition={{ duration: 0.4 }}
											drag="x"
											dragConstraints={{ left: 0, right: 0 }}
											onDragEnd={(_, info) => {
												if (info.offset.x < -100) handleNext();
												if (info.offset.x > 100) handlePrevious();
											}}
											className="group relative aspect-video rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 cursor-pointer"
											onClick={() =>
												setSelectedVideo(videos[visible.current].youtubeUrl)
											}
										>
											<Image
												src={videos[visible.current].thumbnail}
												alt=""
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-700"
											/>
											<div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
												<div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
													<Play className="w-6 h-6 text-white fill-white ml-1" />
												</div>
											</div>
											<div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black via-black/40 to-transparent">
												<p className="text-white/50 text-xs uppercase tracking-[0.3em] mb-2 font-light">
													{formatVideoDate(
														monthKeys,
														videos[visible.current].date,
														t
													)}
												</p>
												<h2 className="text-2xl md:text-4xl font-light text-white tracking-tight">
													{videos[visible.current].title}
												</h2>
											</div>
										</motion.div>
									</AnimatePresence>

									{/* SETA DIREITA (Desktop) */}
									<Button
										variant="ghost"
										size="icon"
										onClick={handleNext}
										className="hidden md:flex absolute -right-6 lg:-right-24 top-1/2 -translate-y-1/2 z-50 h-14 w-14 rounded-full bg-black/50 hover:bg-white/10 text-white backdrop-blur-md border border-white/10 transition-all"
									>
										<ChevronRight size={32} />
									</Button>
								</div>

								{/* PREVIEW DIREITA */}
								<motion.div
									key={`next-bg-${visible.next}`}
									initial={{ opacity: 0, x: 100 }}
									animate={{ opacity: 0.45, x: "20%", scale: 0.75 }}
									transition={{ duration: 0.5 }}
									className="hidden xl:block absolute left-1/2 z-0 pointer-events-none"
								>
									<div className="relative w-[450px] aspect-video rounded-2xl overflow-hidden grayscale-[60%] border border-white/10">
										<Image
											src={videos[visible.next].thumbnail}
											alt=""
											fill
											className="object-cover"
										/>
									</div>
								</motion.div>
							</div>

							{/* CONTROLES MOBILE (Abaixo do vídeo) */}
							<div className="flex md:hidden items-center gap-10">
								<Button
									variant="ghost"
									size="icon"
									onClick={handlePrevious}
									className="h-12 w-12 rounded-full bg-white/5 border border-white/10 text-white"
								>
									<ChevronLeft size={28} />
								</Button>

								<div className="flex gap-2">
									{videos.map((_, i) => (
										<div
											key={i}
											className={`h-1 transition-all duration-300 rounded-full ${
												i === currentIndex ? "w-8 bg-white" : "w-2 bg-white/20"
											}`}
										/>
									))}
								</div>

								<Button
									variant="ghost"
									size="icon"
									onClick={handleNext}
									className="h-12 w-12 rounded-full bg-white/5 border border-white/10 text-white"
								>
									<ChevronRight size={28} />
								</Button>
							</div>
						</div>
					</div>
				</Container>
			</main>

			{/* Lightbox Iframe */}
			<AnimatePresence>
				{selectedVideo && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
						onClick={() => setSelectedVideo(null)}
					>
						<button className="absolute top-6 right-6 text-white/50 hover:text-white">
							<X size={35} />
						</button>
						<div
							className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							<iframe
								src={getEmbedUrl(selectedVideo)}
								className="w-full h-full"
								allow="autoplay; fullscreen"
								allowFullScreen
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</PageWrapper>
	);
}
