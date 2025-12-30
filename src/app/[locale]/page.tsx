"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useTranslations } from "next-intl";
import Link from "next/link";
import PageWrapper from "@/components/transition/PageWrapper";
import Container from "@/components/layout/Container";

export default function Home() {
	const t = useTranslations("home");

	return (
		<PageWrapper>
			<main className={styles.main}>
				<div className={styles.videoWrapper}>
					<video className={styles.media} autoPlay muted loop playsInline>
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
