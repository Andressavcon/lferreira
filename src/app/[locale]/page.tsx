"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";

import PageWrapper from "@/components/transition/PageWrapper";
import Container from "@/components/layout/Container";
import LoadingScreen from "@/components/layout/LoadingScreen";

export default function Home() {
	const t = useTranslations("home");
	const [isVideoLoaded, setIsVideoLoaded] = useState(false);
	const [showContent, setShowContent] = useState(false);

	useEffect(() => {
		const backupTimer = setTimeout(() => {
			if (!isVideoLoaded) setIsVideoLoaded(true);
		}, 3000);

		return () => clearTimeout(backupTimer);
	}, [isVideoLoaded]);

	useEffect(() => {
		if (isVideoLoaded) {
			const timer = setTimeout(() => {
				setShowContent(true);
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [isVideoLoaded]);

	return (
		<PageWrapper>
			<AnimatePresence>
				{!showContent && <LoadingScreen key="loader-home" />}
			</AnimatePresence>

			<main
				className={styles.main}
				style={{
					opacity: showContent ? 1 : 0,
					transition: "opacity 1.5s ease-in-out",
					visibility: showContent ? "visible" : "hidden",
				}}
			>
				<div className={styles.videoWrapper}>
					<video
						className={styles.media}
						autoPlay
						muted
						loop
						playsInline
						onLoadedData={() => setIsVideoLoaded(true)}
					>
						<source src="/video/bkg-home.mp4" type="video/mp4" />
					</video>
					<div className={styles.overlay} />
				</div>

				<Container
					clean
					className="relative z-10 flex flex-col items-center justify-center text-center"
				>
					<div className={styles.content}>
						<div className={styles.logoWrapper}>
							<Image
								src="/img/logo/lferreira.svg"
								alt="LFerreira"
								width={320}
								height={80}
								priority
								className={styles.logo}
							/>
						</div>

						<p className={styles.subtitle}>{t("subtitle")}</p>

						<Link href="/contact" className={styles.cta}>
							{t("contact")}
						</Link>
					</div>
				</Container>
			</main>
		</PageWrapper>
	);
}
