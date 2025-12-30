"use client";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import Container from "../layout/Container";
import BackgroundImage from "../layout/BackgroundImage";
import { galleryImages } from "./GalleryData";
import { useTranslations } from "next-intl";
import PageWrapper from "@/components/transition/PageWrapper";

export default function Gallery() {
	const t = useTranslations("gallery");
	const [selectedImage, setSelectedImage] = useState<number | null>(null);

	return (
		<PageWrapper>
			<main className="relative h-screen overflow-hidden">
				<BackgroundImage
					src="/img/gallery/15.jpeg"
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

										<Image
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
			{selectedImage !== null && (
				<div
					className="fixed mt-10 inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-md p-6 md:p-12"
					onClick={() => setSelectedImage(null)}
				>
					<button
						onClick={() => setSelectedImage(null)}
						className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors z-[1010]"
					>
						<X size={40} />
					</button>

					<div
						className="relative w-full h-full max-w-5xl max-h-[80vh] flex items-center justify-center"
						onClick={(e) => e.stopPropagation()}
					>
						<Image
							src={
								galleryImages.find((img) => img.id === selectedImage)?.src || ""
							}
							alt="Full size"
							fill
							className="object-contain"
							quality={85}
							priority
							sizes="90vw"
						/>
					</div>
				</div>
			)}
		</PageWrapper>
	);
}
