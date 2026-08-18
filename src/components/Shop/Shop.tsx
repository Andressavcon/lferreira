"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence } from "framer-motion";

import { usePageLoader } from "@/hooks/usePageLoader";
import BackgroundImage from "../layout/BackgroundImage";
import Container from "../layout/Container";
import LoadingScreen from "../layout/LoadingScreen";
import PageWrapper from "@/components/transition/PageWrapper";
import ProductCard from "./ProductCard";

export default function Shop() {
	const tShop = useTranslations("shop");
	const bgImage = "/img/gallery/8.jpg";

	const loading = usePageLoader(bgImage);

	return (
		<PageWrapper>
			<AnimatePresence mode="wait">
				{loading && <LoadingScreen key="loader-shop" />}
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
					imageOpacity={0.4}
					overlayOpacity={0.7}
				/>
				<Container
					title={tShop("title")}
					paddingTop={true}
					className="overflow-y-auto custom-scrollbar"
				>
					<div className="relative z-10 flex flex-col items-start justify-start w-full pt-4">
						<ProductCard />
					</div>
				</Container>
			</main>
		</PageWrapper>
	);
}
