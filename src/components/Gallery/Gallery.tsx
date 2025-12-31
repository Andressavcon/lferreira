"use client";

import { useState } from "react";
import NextImage from "next/image";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

import { usePageLoader } from "@/hooks/usePageLoader";
import Container from "../layout/Container";
import BackgroundImage from "../layout/BackgroundImage";
import LoadingScreen from "../layout/LoadingScreen";
import PageWrapper from "@/components/transition/PageWrapper";

import { galleryImages } from "./GalleryData";

export default function Gallery() {
	const t = useTranslations("gallery");
	const [selectedImage, setSelectedImage] = useState<number | null>(null);
	const bgImage = "/img/gallery/15.jpeg";

	const loading = usePageLoader(bgImage);

	return (
		<PageWrapper>
			<AnimatePresence mode="wait">
				{loading && <LoadingScreen key="loader-gallery" />}
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
					imageOpacity={0.3}
					overlayOpacity={0.6}
				/>
				<Container
					title={t("title")}
					paddingTop={true}
					className="overflow-y-auto custom-scrollbar"
				>
					<div className="relative z-10 pt-8 pb-32">
						<div className="grid w-full grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[200px] grid-flow-dense">
							{galleryImages.map((image, index) => {
								const isWide = image.span.includes("md:col-span-2");
								const isTall = image.span.includes("md:row-span-2");

								return (
									<div
										key={image.id}
										className={`group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 active:scale-95 
                                            ${
																							isWide
																								? "col-span-2"
																								: "col-span-1"
																						} 
                                            ${
																							isTall
																								? "row-span-2"
																								: "row-span-1"
																						} 
                                            ${
																							image.span
																						} /* Aqui entram as regras md: do seu GalleryData */
                                        `}
										onClick={() => setSelectedImage(image.id)}
									>
										<div className="absolute inset-0 bg-black/40 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
											<span className="text-white text-xs tracking-widest uppercase border border-white/40 px-4 py-2 scale-90 group-hover:scale-100 transition-transform">
												{t("view")}
											</span>
										</div>

										<NextImage
											src={image.src}
											alt={image.description || "Gallery image"}
											fill
											priority={index < 4}
											className="object-cover transition-transform duration-700 group-hover:scale-110"
											sizes="(max-width: 768px) 50vw, 25vw"
										/>
									</div>
								);
							})}
						</div>
					</div>
				</Container>
			</main>

			{/* Lightbox */}
			<AnimatePresence>
				{selectedImage !== null && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="fixed mt-10 inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-md p-6 md:p-12"
						onClick={() => setSelectedImage(null)}
					>
						<motion.button
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							onClick={() => setSelectedImage(null)}
							className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors z-[1010]"
						>
							<X size={40} />
						</motion.button>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="relative w-full h-full max-w-5xl max-h-[80vh] flex items-center justify-center"
							onClick={(e) => e.stopPropagation()}
						>
							<NextImage
								src={
									galleryImages.find((img) => img.id === selectedImage)?.src ||
									""
								}
								alt="Full size"
								fill
								className="object-contain"
								quality={85}
								priority
								sizes="90vw"
							/>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</PageWrapper>
	);
}
