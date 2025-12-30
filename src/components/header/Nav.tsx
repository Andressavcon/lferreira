"use client";
import { useTranslations } from "next-intl";
import styles from "./Header.module.css";
import { usePathname } from "@/navigation";
import { Menu } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
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
		navigate(href);
	};

	return (
		<div className="flex items-center">
			{/* --- VERSÃO DESKTOP --- */}
			<nav className="hidden lg:flex items-center gap-8 mr-8">
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<button
							key={item.href}
							onClick={() => handleNavigation(item.href)}
							className={`${styles.link} ${
								isActive ? styles.active : ""
							} font-bogle`}
						>
							{item.label}
						</button>
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
						className="bg-black/95 border-zinc-800 p-0 text-white w-[250px]"
					>
						<SheetTitle className="sr-only">Menu de Navegação</SheetTitle>

						<nav className="flex flex-col mt-20 px-8 h-full">
							{navItems.map((item) => {
								const isActive = pathname === item.href;
								return (
									<button
										key={item.href}
										onClick={() => handleNavigation(item.href)}
										className={`py-4 text-left text-xl font-bogle uppercase tracking-[0.2em] border-b border-white/5 transition-colors ${
											isActive
												? "text-cyan-400"
												: "text-white/60 hover:text-white"
										}`}
									>
										{item.label}
									</button>
								);
							})}

							<div className="mt-8 pt-8 ">
								<div className="scale-125 origin-left">
									<LanguageSwitcher />
								</div>
							</div>
						</nav>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
}
