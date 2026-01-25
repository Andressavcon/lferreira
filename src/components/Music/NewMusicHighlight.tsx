"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface NewMusicProps {
	item: {
		id: number;
		title: string;
		description: string;
		image: string;
		links: {
			spotify?: string;
			youtube?: string;
			deezer?: string;
			apple?: string;
		};
	};
}

export function NewMusicHighlight({ item }: NewMusicProps) {
	const t = useTranslations("music");

	return (
		<section className="relative w-full">
			<div className="container mx-auto px-4 flex flex-col items-center">
				<div className="mb-4 border border-cyan-500/90 px-6 py-1">
					<span className="text-cyan-500 text-[16px] md:text-xs font-bold tracking-[0.5em] uppercase whitespace-nowrap">
						{t("newRelease")}
					</span>
				</div>

				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="relative group w-full max-w-[200px] md:max-w-[300px] aspect-square shadow-2xl mb-6"
				>
					<Image
						src={item.image}
						alt={item.title}
						fill
						priority
						className="object-cover rounded-sm"
						sizes="(max-width: 768px) 200px, 300px"
					/>

					<div className="absolute -z-10 inset-0 blur-3xl opacity-20 bg-cyan-500 rounded-full" />
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="text-center w-full"
				>
					<h2 className="text-3xl md:text-5xl font-light uppercase tracking-[0.4em] text-white mb-4">
						{item.title}
					</h2>

					<p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-6">
						{t(`descriptionNew`)}
					</p>

					<div className="flex flex-wrap justify-center gap-8 md:gap-12 text-xs md:text-sm uppercase tracking-[0.3em] text-zinc-500">
						{item.links.spotify && (
							<a
								href={item.links.spotify}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-green-400 transition-colors flex items-center gap-2"
							>
								Spotify
							</a>
						)}
						{/* {item.links.youtube && (
                            <a
                                href={item.links.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-red-500 transition-colors flex items-center gap-2"
                            >
                                YouTube
                            </a>
                        )} */}
						{/* {item.links.apple && (
                            <a
                                href={item.links.apple}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors flex items-center gap-2"
                            >
                                Apple Music
                            </a>
                        )} */}
						{item.links.deezer && (
							<a
								href={item.links.deezer}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-cyan-400 transition-colors flex items-center gap-2"
							>
								Deezer
							</a>
						)}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
