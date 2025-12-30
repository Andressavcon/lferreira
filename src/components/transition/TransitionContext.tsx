"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";

type TransitionContextType = {
	navigate: (href: string) => void;
	isTransitioning: boolean;
};

const TransitionContext = createContext<TransitionContextType | null>(null);

export function TransitionProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const [isTransitioning, setIsTransitioning] = useState(false);

	const navigate = useCallback(
		(href: string) => {
			const current = pathname.replace(/\/$/, "");
			const target = href.replace(/\/$/, "");

			if (current === target || isTransitioning) return;

			setIsTransitioning(true);

			setTimeout(() => {
				router.push(href, { scroll: false });
			}, 200);
		},
		[pathname, isTransitioning, router]
	);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsTransitioning(false);
			window.scrollTo(0, 0);
		}, 50);

		return () => clearTimeout(timer);
	}, [pathname]);

	return (
		<TransitionContext.Provider value={{ navigate, isTransitioning }}>
			{children}
		</TransitionContext.Provider>
	);
}

export function useTransitionNav() {
	const ctx = useContext(TransitionContext);
	if (!ctx)
		throw new Error("useTransitionNav must be used inside TransitionProvider");
	return ctx;
}
