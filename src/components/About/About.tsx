"use client";
import Container from "../layout/Container";
import BackgroundImage from "../layout/BackgroundImage";
import { useTranslations } from "next-intl";
import PageWrapper from "@/components/transition/PageWrapper";

export default function About() {
	const t = useTranslations("about");

	return (
		<PageWrapper>
			<main className="relative h-screen overflow-hidden">
				<BackgroundImage
					src="/img/about.jpg"
					imageOpacity={0.9}
					overlayOpacity={0.1}
					objectPosition="60% center"
					priority={true}
				/>

				<Container
					title={t("title")}
					paddingTop={true}
					className="overflow-y-auto custom-scrollbar pb-20"
				>
					<div className="relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
						<div className="max-w-3xl space-y-6 md:space-y-10">
							<div className="space-y-6 md:space-y-8 text-base md:text-lg leading-relaxed text-zinc-300">
								<p>{t("p1")}</p>
								<p>{t("p2")}</p>
								<p>{t("p3")}</p>
								<p>{t("p4")}</p>
							</div>

							<div className="pt-2">
								<a
									href="https://drive.google.com/drive/folders/1PsU0gZPESvIgQ5VxxvhtV1N9w4L5LZnn?usp=sharing"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-block font-bogle text-xs md:text-sm tracking-[0.25em] text-white border border-white/60 px-8 py-4 transition hover:bg-white hover:text-black uppercase"
								>
									{t("presskit")}
								</a>
							</div>
						</div>
					</div>
				</Container>
			</main>
		</PageWrapper>
	);
}
