"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	function switchLanguage() {
		const newLocale = locale === "pt" ? "en" : "pt";
		const segments = pathname.split("/");
		segments[1] = newLocale;
		router.push(segments.join("/"));
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={switchLanguage}
			aria-label="Change language"
			className="flex items-center gap-1 hover:bg-transparent focus-visible:bg-transparent"
		>
			<Globe className="h-5 w-5" />
			<span className="font-bogle">{locale === "pt" ? "PT" : "EN"}</span>
		</Button>
	);
}
