import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import ClientLayout from "./ClientLayout";
import "../globals.css";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

export const roboto = Roboto({
	subsets: ["latin"],
	weight: ["400", "500", "700"],
	variable: "--font-roboto",
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL("https://www.lferreiralive.com.br"),
	title: "LFERREIRA | DJ & Producer",
	description: "DJ / Music Producer",
	alternates: {
		canonical: "/",
		languages: {
			"pt-BR": "/pt",
			"en-US": "/en",
		},
	},
	openGraph: {
		title: "LFERREIRA | DJ & Producer",
		description: "DJ / Music Producer",
		type: "website",
	},
};

interface LocaleLayoutProps {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
	children,
	params,
}: LocaleLayoutProps) {
	const { locale } = await params;

	let messages;
	try {
		messages = await getMessages({ locale });
	} catch {
		notFound();
	}

	return (
		<html lang={locale}>
			<body className={`${roboto.variable} font-sans`}>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<ClientLayout>{children}</ClientLayout>
				</NextIntlClientProvider>
				<ScrollToTop />
			</body>
		</html>
	);
}
