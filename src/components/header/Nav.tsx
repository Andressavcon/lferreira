"use client";
import { useTranslations } from "next-intl";
import styles from "./Header.module.css";
import { usePathname } from "@/navigation";
import { Menu } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import { motion } from "framer-motion"; // <-- ADICIONE ESTA IMPORTAÇÃO
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useTransitionNav } from "../transition/TransitionContext";

export default function Nav() {
	const pathname = usePathname();
	const { navigate } = useTransitionNav();
	const t = useTranslations("header");
	const [open, setOpen] = useState(false);
	const [hasMusicNotification, setHasMusicNotification] = useState(true);

	const navItems = [
		{ href: "/", label: t("home") },
		{ href: "/about", label: t("about") },
		{ href: "/music", label: t("music") },
		{ href: "/gallery", label: t("gallery") },
		{ href: "/videos", label: t("videos") },
		{ href: "/shop", label: t("shop") },
		{ href: "/contact", label: t("contact") },
	];

	const handleNavigation = (href: string) => {
		setOpen(false);
		if (href === "/music") {
			setHasMusicNotification(false);
		}
		navigate(href);
	};

	return (
		<div className="flex items-center">
			{/* --- VERSÃO DESKTOP --- */}
			<nav className="hidden lg:flex items-center gap-8 pt-1 mr-8">
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					const isMusic = item.href === "/music";

					return (
						<motion.button
							key={item.href}
							onClick={() => handleNavigation(item.href)}
							className={`${styles.link} ${
								isActive ? styles.active : ""
							} font-bogle relative px-2`}
							animate={
								isMusic && hasMusicNotification
									? {
											scale: [1, 1.05, 1],
											color: ["#ffffff", "#22d3ee", "#ffffff"],
										}
									: {}
							}
							transition={
								isMusic
									? {
											duration: 2,
											repeat: Infinity,
											ease: "easeInOut",
										}
									: {}
							}
						>
							{item.label}

							{isMusic && hasMusicNotification && (
								<motion.span
									className="absolute -top-1 -right-1 flex h-1 w-1"
									animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
									transition={{ duration: 1.5, repeat: Infinity }}
								>
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
									<span className="relative inline-flex rounded-full h-1 w-1 bg-cyan-500"></span>
								</motion.span>
							)}
						</motion.button>
					);
				})}
			</nav>

			{/* --- VERSÃO MOBILE (Hambúrguer) --- */}
			<div className="lg:hidden flex items-center">
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<button className="p-2 text-white outline-none" aria-label="Menu">
							<Menu size={32} />
						</button>
					</SheetTrigger>

					<SheetContent
						side="right"
						className="bg-black/90 backdrop-blur-xl border-zinc-800 p-0 text-white w-[250px]"
					>
						<SheetTitle className="sr-only">Menu de Navegação</SheetTitle>

						<nav className="flex flex-col mt-20 px-8 h-full">
							{navItems.map((item, index) => {
								const isActive = pathname === item.href;
								const isMusic = item.href === "/music";

								return (
									<motion.button
										key={item.href}
										animate={
											isMusic && hasMusicNotification
												? {
														x: [0, 5, 0], // Leve balanço lateral
														color: ["#ffffff", "#22d3ee", "#ffffff"],
													}
												: open
													? { opacity: 1, x: 0 }
													: { opacity: 0, x: 10 }
										}
										transition={
											isMusic
												? {
														x: {
															duration: 2,
															repeat: Infinity,
															ease: "easeInOut",
														},
														color: { duration: 2, repeat: Infinity },
														delay: open ? index * 0.07 : 0,
													}
												: {
														delay: open ? index * 0.07 : 0,
														duration: 0.2,
													}
										}
										onClick={() => handleNavigation(item.href)}
										className={`py-4 text-left text-xl font-bogle uppercase tracking-[0.2em] border-b border-white/5 transition-colors flex items-center justify-between ${
											isActive ? "text-cyan-400" : "text-white/60"
										}`}
									>
										{item.label}
										{isMusic && hasMusicNotification && (
											<span className="ml-2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
										)}
									</motion.button>
								);
							})}

							<motion.div
								initial={{ opacity: 0 }}
								animate={open ? { opacity: 1 } : { opacity: 0 }}
								transition={{ delay: navItems.length * 0.1 }}
								className="mt-8 pt-8"
							>
								<div className="scale-125 origin-left">
									<LanguageSwitcher />
								</div>
							</motion.div>
						</nav>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
}
