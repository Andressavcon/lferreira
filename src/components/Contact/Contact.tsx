"use client";

import { useState } from "react";
import { FaDeezer, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import { SiApplemusic } from "react-icons/si";
import { PiMapPinFill } from "react-icons/pi";
import { IoMail } from "react-icons/io5";
import Container from "../layout/Container";
import BackgroundImage from "../layout/BackgroundImage";
import { Button } from "../ui";
import { useTranslations } from "next-intl";
import { Section } from "../layout/Section";
import PageWrapper from "@/components/transition/PageWrapper";
import { motion } from "framer-motion";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xzdpopkq";

export default function Contact() {
	const t = useTranslations("contact");

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");
		try {
			const response = await fetch(FORMSPREE_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(formData),
			});
			if (!response.ok) throw new Error("Error");
			setStatus("success");
			setFormData({ name: "", email: "", subject: "", message: "" });
		} catch {
			setStatus("error");
		}
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<PageWrapper>
			<main className="relative">
				<BackgroundImage
					src="/img/KJ-130.jpeg"
					imageOpacity={0.3}
					overlayOpacity={0.4}
					objectPosition="60% center"
				/>

				<Section className="pt-24 lg:pt-32 pb-12">
					<Container title={t("title")}>
					
						<div className="relative z-10 flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-32 mt-8 lg:mt-16">
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="space-y-10"
							>
								<div className="space-y-6 text-base lg:text-lg text-zinc-400 font-light">
									<a
										href="mailto:contatolferreiralive@gmail.com"
										className="flex items-center gap-4 hover:text-white transition-colors group"
									>
										<div className="w-10 h-10 shrink-0 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
											<IoMail size={18} />
										</div>
										<span className="break-all lg:break-normal">
											contatolferreiralive@gmail.com
										</span>
									</a>

									<div className="flex items-center gap-4">
										<div className="w-10 h-10 shrink-0 rounded-full bg-white/5 flex items-center justify-center">
											<PiMapPinFill size={18} />
										</div>
										Santa Catarina, BR
									</div>
								</div>

								<div className="flex justify-center lg:justify-start items-center gap-6 pt-6 border-t border-white/5">
									{[
										{
											icon: <FaInstagram />,
											href: "https://www.instagram.com/lferreiralive/",
										},
										{
											icon: <FaYoutube />,
											href: "https://www.youtube.com/@lferreiralive",
										},
										{ icon: <FaSpotify />, href: "#" },
										{
											icon: <FaDeezer />,
											href: "https://link.deezer.com/s/321cRYUuFpoVvNH2w8IqC",
										},
										{
											icon: <SiApplemusic />,
											href: "https://music.apple.com/us/artist/lferreira/1255992554",
										},
									].map((social, idx) => (
										<a
											key={idx}
											href={social.href}
											target="_blank"
											className="text-zinc-500 hover:text-white transition-all transform hover:scale-110"
										>
											{social.icon}
										</a>
									))}
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}
							>
								<form
									onSubmit={handleSubmit}
									className="w-full space-y-6 bg-black/40 backdrop-blur-md p-4 lg:p-8 rounded-3xl border border-white/5 shadow-2xl"
								>
									<div className="space-y-4">
										<input
											type="text"
											name="name"
											placeholder={t("name")}
											value={formData.name}
											onChange={handleChange}
											required
											className="w-full bg-transparent border-b border-white/10 py-2 text-white placeholder-zinc-500 focus:border-white focus:outline-none transition-all font-light"
										/>

										<input
											type="email"
											name="email"
											placeholder={t("email")}
											value={formData.email}
											onChange={handleChange}
											required
											className="w-full bg-transparent border-b border-white/10 py-2 text-white placeholder-zinc-500 focus:border-white focus:outline-none transition-all font-light"
										/>

										<div className="relative border-b border-white/10">
											<select
												name="subject"
												value={formData.subject}
												onChange={handleChange}
												required
												className="w-full bg-transparent py-2 text-zinc-400 focus:text-white focus:outline-none transition-all font-light appearance-none relative z-10"
											>
												<option value="" disabled className="bg-zinc-900">
													{t("options.title")}
												</option>
												<option
													value={t("options.fan")}
													className="bg-zinc-900"
												>
													{t("options.fan")}
												</option>
												<option
													value={t("options.musician")}
													className="bg-zinc-900"
												>
													{t("options.musician")}
												</option>
												<option
													value={t("options.booking")}
													className="bg-zinc-900"
												>
													{t("options.booking")}
												</option>
												<option
													value={t("options.press")}
													className="bg-zinc-900"
												>
													{t("options.press")}
												</option>
												<option
													value={t("options.other")}
													className="bg-zinc-900"
												>
													{t("options.other")}
												</option>
											</select>
											<div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-xs text-[8px]">
												▼
											</div>
										</div>

										<textarea
											name="message"
											placeholder={t("message")}
											rows={2}
											value={formData.message}
											onChange={handleChange}
											required
											className="w-full resize-none bg-transparent border-b border-white/10 py-2 text-white placeholder-zinc-500 focus:border-white focus:outline-none transition-all font-light"
										/>
									</div>

									<div className="pt-1">
										<Button
											type="submit"
											disabled={status === "loading"}
											className="w-full lg:w-auto px-10 py-2 border border-white/10 bg-white/5 hover:bg-white hover:text-black transition-all duration-500 uppercase tracking-[0.3em] text-[10px]"
										>
											{status === "loading" ? t("sending") : t("send")}
										</Button>
									</div>

									{status === "success" && (
										<p className="text-[10px] text-green-400 tracking-widest uppercase animate-pulse pt-2">
											{t("messageSuccess")}
										</p>
									)}
									{status === "error" && (
										<p className="text-[10px] text-red-400 tracking-widest uppercase pt-2">
											{t("messageError")}
										</p>
									)}
								</form>
							</motion.div>
						</div>
					</Container>
				</Section>
			</main>
		</PageWrapper>
	);
}
