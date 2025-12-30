"use client";

import Header from "@/components/header/Header";
import PageOverlay from "@/components/transition/PageOverlay";
import { TransitionProvider } from "@/components/transition/TransitionContext";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<TransitionProvider>
			<Header />
			<PageOverlay />
			<main className="min-h-screen">{children}</main>
		</TransitionProvider>
	);
}
