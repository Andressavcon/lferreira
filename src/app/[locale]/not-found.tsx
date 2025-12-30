"use client";

import BackgroundImage from "@/components/layout/BackgroundImage";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
	const t = useTranslations("notFound");

	return (
		<>
			<BackgroundImage
				src="/img/gallery/8.jpg"
				imageOpacity={0.5}
				overlayOpacity={0.8}
			/>
			<div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-neutral-100 px-6">
				<div className="flex items-center gap-2 animate-logo-grow">
					<Image
						src="/img/logo/lferreira-base.svg"
						alt="L Ferreira"
						width={260}
						height={70}
						priority
					/>

					<Image
						src="/img/logo/lferreira-a.svg"
						alt="A girando"
						width={42}
						height={42}
						className="spin-a"
						priority
					/>
				</div>

				{/* Texto */}
				<div className="mt-14 text-center animate-fade-in max-w-md">
					<p className=" text-5xl uppercase tracking-[0.35em] text-neutral-400">
						{t("subtitle")}
					</p>

					<h1 className="mt-6 text-xl font-light tracking-[0.18em] leading-relaxed ">
						{t("message1")}
					</h1>

					<p className="mt-4 text-sm tracking-wide text-neutral-400 ">
						{t("message2")}
					</p>
				</div>

				<Link
					href="/"
					className="mt-14 text-xs uppercase tracking-[0.35em] z-50 text-neutral-400 transition hover:text-white"
				>
					{t("message3")}
				</Link>
			</div>
		</>
	);
}
