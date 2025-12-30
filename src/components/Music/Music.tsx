"use client";
import BackgroundImage from "../layout/BackgroundImage";
import Container from "../layout/Container";
import { musicData } from "./MusicData";
import { MusicTimelineItem } from "./MusicTimelineItem";
import { Button } from "../ui";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import PageWrapper from "@/components/transition/PageWrapper";

export default function Music() {
	const t = useTranslations("music");

	return (
		<PageWrapper>
			<main className="relative h-screen overflow-hidden">
				<BackgroundImage
					src="/img/KJ-157.jpeg"
					imageOpacity={0.15}
					overlayOpacity={0.4}
					objectPosition="center center"
				/>

				<Container
					title={t("title")}
					paddingTop={true}
					className="overflow-y-auto custom-scrollbar"
				>
					<div className="relative z-10 flex flex-col gap-10 lg:gap-16 items-start pb-24">
						<div className="relative mx-auto w-full max-w-6xl mt-10">
							<div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-zinc-800 hidden lg:block" />

							<div className="space-y-24 lg:space-y-40">
								{musicData.map((item, index) => (
									<MusicTimelineItem key={item.id} item={item} index={index} />
								))}
							</div>
						</div>

						<div className="w-full flex justify-center pt-10 pb-12">
							<Button
								onClick={() =>
									window.open(
										"https://open.spotify.com/intl-pt/artist/6fRJBaRKnWBjZaDulWEvAZ?flow_ctx=1dba7b75-706b-4037-94e4-4d83721bc72e%3A1766436252",
										"_blank"
									)
								}
								variant="ghost"
								className="group relative flex items-center gap-4 px-8 py-6 rounded-full bg-white/[0.03] border border-white/10 text-zinc-300 hover:text-white transition-all duration-700"
							>
								<span className="text-[10px] lg:text-xs font-light tracking-[0.3em] uppercase">
									{t("viewMore")}
								</span>
								<div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-white/10 group-hover:border-white/40">
									<Plus
										size={14}
										className="text-zinc-400 group-hover:text-white"
									/>
								</div>
							</Button>
						</div>
					</div>
				</Container>
			</main>
		</PageWrapper>
	);
}
