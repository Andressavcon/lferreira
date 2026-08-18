"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useTranslations } from "next-intl";
import { formatInstagram, formatPhone } from "@/lib/utils";

type ContactType = "email" | "whatsapp" | "instagram";

interface InterestModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product: string;
	videoUrl?: string;
}

const SIZES = ["P", "M", "G", "GG"];

export default function InterestModal({
	open,
	onOpenChange,
	product,
	videoUrl,
}: InterestModalProps) {
	const t = useTranslations("shop.modal");

	const [mounted, setMounted] = useState(false);

	const [name, setName] = useState("");
	const [contactType, setContactType] = useState<ContactType>("email");
	const [contact, setContact] = useState("");
	const [size, setSize] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);

		try {
			const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

			if (!GOOGLE_SCRIPT_URL) {
				throw new Error("ERROR: URL Google Script Not defined");
			}

			await axios.post(
				GOOGLE_SCRIPT_URL,
				JSON.stringify({
					product,
					name,
					contactType,
					contact,
					size,
				}),
				{
					headers: {
						"Content-Type": "text/plain;charset=utf-8",
					},
				},
			);
			setSuccess(true);
		} catch {
			toast.error(t("errorMessage"));
		} finally {
			setLoading(false);
		}
	}

	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen);
		if (!nextOpen) {
			setTimeout(() => {
				setSuccess(false);
				setName("");
				setContact("");
				setSize(null);
				setContactType("email");
			}, 200);
		}
	}

	const contactPlaceholder: Record<ContactType, string> = {
		email: "seu@email.com",
		whatsapp: "(11) 91234-5678",
		instagram: "@seuusuario",
	};

	if (!mounted) return null;

	return (
		<Dialog.Root open={open} onOpenChange={handleOpenChange}>
			<AnimatePresence>
				{open && (
					<Dialog.Portal forceMount>
						<Dialog.Overlay asChild>
							<motion.div
								className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							/>
						</Dialog.Overlay>

						<Dialog.Content asChild>
							<motion.div
								className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden focus:outline-none max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl"
								initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
								animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
								exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
								transition={{ duration: 0.15, ease: "easeOut" }}
							>
								<Dialog.Close asChild>
									<button
										className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 text-neutral-400 hover:text-white transition-colors"
										aria-label={t("close")}
									>
										<X size={18} />
									</button>
								</Dialog.Close>

								<div className="grid grid-cols-1 md:grid-cols-2 min-h-[480px]">
									<div className="relative w-full h-64 md:h-full bg-neutral-900 overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
										{videoUrl ? (
											<video
												src={videoUrl}
												autoPlay
												loop
												muted
												playsInline
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-neutral-900 to-black">
												<span className="text-xs uppercase tracking-widest text-neutral-500">
													Prévia do Produto
												</span>
											</div>
										)}
									</div>

									<div className="p-6 md:p-8 flex flex-col justify-center">
										{success ? (
											<div className="py-6 text-center">
												<div className="mx-auto w-12 h-12 rounded-full border border-cyan-400 flex items-center justify-center mb-4">
													<Check className="text-cyan-400" size={20} />
												</div>
												<Dialog.Title className="text-lg font-extralight tracking-[0.15em] text-white uppercase">
													{t("successTitle")}
												</Dialog.Title>
												<p className="mt-3 text-sm text-neutral-400 leading-relaxed">
													{t("successDescription")}
												</p>
												<Dialog.Close asChild>
													<button className="mt-8 group relative overflow-hidden px-6 py-3">
														<span className="relative z-10 text-[10px] uppercase tracking-[0.4em] text-neutral-400 group-hover:text-white transition-colors duration-300">
															{t("close")}
														</span>
														<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-cyan-400 transition-all duration-300 group-hover:w-full" />
													</button>
												</Dialog.Close>
											</div>
										) : (
											<>
												<Dialog.Title className="text-lg md:text-xl font-extralight tracking-[0.15em] text-white uppercase pr-6">
													{t("title")}
												</Dialog.Title>
												<Dialog.Description className="mt-2 text-xs md:text-sm text-neutral-400 leading-relaxed">
													{t("description", { product: product.toUpperCase() })}
												</Dialog.Description>

												<form
													onSubmit={handleSubmit}
													className="mt-6 space-y-5"
												>
													<input
														type="text"
														required
														autoFocus
														value={name}
														onChange={(e) => setName(e.target.value)}
														placeholder={t("namePlaceholder")}
														className="w-full bg-transparent border-b border-white/10 text-white placeholder-neutral-500 py-2 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
													/>

													<div>
														<p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
															{t("contactTypeLabel")}
														</p>
														<div className="grid grid-cols-3 gap-1.5">
															{(
																[
																	"email",
																	"whatsapp",
																	"instagram",
																] as ContactType[]
															).map((type) => (
																<button
																	key={type}
																	type="button"
																	onClick={() => {
																		setContactType(type);
																		setContact("");
																	}}
																	className={`text-[9px] uppercase tracking-wider py-2 px-1 rounded-full border transition-colors truncate ${
																		contactType === type
																			? "border-cyan-400 text-cyan-400"
																			: "border-white/10 text-neutral-500 hover:border-white/30"
																	}`}
																>
																	{t(type)}
																</button>
															))}
														</div>
													</div>

													<input
														type={contactType === "email" ? "email" : "text"}
														required
														value={contact}
														onChange={(e) => {
															const val = e.target.value;

															if (contactType === "whatsapp") {
																setContact(formatPhone(val));
															} else if (contactType === "instagram") {
																setContact(formatInstagram(val));
															} else {
																setContact(val);
															}
														}}
														onFocus={() => {
															if (contactType === "instagram" && !contact) {
																setContact("@");
															}
														}}
														placeholder={contactPlaceholder[contactType]}
														maxLength={
															contactType === "whatsapp"
																? 15
																: contactType === "instagram"
																	? 31
																	: undefined
														}
														pattern={
															contactType === "email"
																? "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
																: undefined
														}
														title={
															contactType === "email"
																? "Insira um endereço de e-mail válido (ex: nome@dominio.com)"
																: undefined
														}
														className="w-full bg-transparent border-b border-white/10 text-white placeholder-neutral-500 py-2 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
													/>

													<div>
														<p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
															{t("sizeLabel")}
														</p>
														<div className="flex gap-2">
															{SIZES.map((s) => (
																<button
																	key={s}
																	type="button"
																	onClick={() => setSize(size === s ? null : s)}
																	className={`w-9 h-9 text-xs rounded-full border transition-colors ${
																		size === s
																			? "border-cyan-400 text-cyan-400"
																			: "border-white/10 text-neutral-500 hover:border-white/30"
																	}`}
																>
																	{s}
																</button>
															))}
														</div>
													</div>

													<button
														type="submit"
														disabled={loading}
														className="w-full group relative overflow-hidden py-3 disabled:opacity-50 mt-2"
													>
														<span className="relative z-10 text-[10px] uppercase tracking-[0.4em] text-neutral-400 group-hover:text-white transition-colors duration-300">
															{loading ? t("submitting") : t("submitButton")}
														</span>
														<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-cyan-400 transition-all duration-300 group-hover:w-full" />
													</button>
												</form>
											</>
										)}
									</div>
								</div>
							</motion.div>
						</Dialog.Content>
					</Dialog.Portal>
				)}
			</AnimatePresence>
		</Dialog.Root>
	);
}
