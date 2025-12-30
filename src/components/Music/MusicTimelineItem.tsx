"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface MusicItemProps {
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
	index: number;
}

export function MusicTimelineItem({ item, index }: MusicItemProps) {
	const t = useTranslations("music");
	const isEven = index % 2 === 0;

	return (
		<div className="relative w-full">
			<div className="flex flex-col items-center text-center lg:grid lg:grid-cols-2 lg:items-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className={`
                        w-full flex justify-center mb-8 lg:mb-0
                        ${
													isEven
														? "lg:pr-20 lg:justify-end"
														: "lg:order-2 lg:pl-20 lg:justify-start"
												}
                    `}
				>
					<div className="relative aspect-square w-full max-w-[280px] md:max-w-xs shadow-2xl">
						<Image
							src={item.image}
							alt={item.title}
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 40vw"
						/>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className={`
                        w-full px-4 lg:px-0
                        ${
													isEven
														? "lg:pl-20 lg:text-left"
														: "lg:order-1 lg:pr-20 lg:text-right"
												}
                    `}
				>
					<h2 className="text-2xl md:text-3xl lg:text-4xl font-light uppercase tracking-[0.3em] text-white">
						{item.title}
					</h2>

					<p
						className={`mt-4 mx-auto text-sm leading-relaxed text-zinc-400 lg:text-base ${
							isEven ? "lg:ml-0" : "lg:mr-0"
						}`}
					>
						{t(`description${item.id}`)}
					</p>

					<div
						className={`mt-8 flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-[0.3em] text-zinc-500 ${
							isEven ? "lg:justify-start" : "lg:justify-end"
						}`}
					>
						{item.links.spotify && (
							<a
								href={item.links.spotify}
								className="hover:text-cyan-400 transition-colors"
							>
								Spotify
							</a>
						)}
						{item.links.youtube && (
							<a
								href={item.links.youtube}
								className="hover:text-cyan-400 transition-colors"
							>
								YouTube
							</a>
						)}
						{item.links.apple && (
							<a
								href={item.links.apple}
								className="hover:text-cyan-400 transition-colors"
							>
								Apple
							</a>
						)}
					</div>
				</motion.div>
			</div>

			<span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white hidden lg:block shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
		</div>
	);
}
