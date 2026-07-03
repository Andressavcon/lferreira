"use client";
import styles from "./Header.module.css";
import Container from "../layout/Container";
import { useTransitionNav } from "../transition/TransitionContext";
import Nav from "./Nav";
import Logo from "./Logo";
import { useLocale } from "next-intl";
import LanguageSwitcher from "../LanguageSwitcher";
import { usePathname } from "next/navigation";

export default function Header() {
	const { navigate } = useTransitionNav();
	const locale = useLocale();

	const pathname = usePathname(); // 👈 novo

	if (pathname.includes("/guest-cup")) {
		return null;
	}

	return (
		<header className={styles.header}>
			<Container clean className={styles.inner}>
				<Logo onClick={() => navigate(`/${locale}/`)} />

				<div className="flex items-center gap-2 md:gap-6 lg:flex-row-reverse">
					<div className={`${styles.langButton} hidden lg:block`}>
						<LanguageSwitcher />
					</div>

					<Nav />
				</div>
			</Container>
		</header>
	);
}
