"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePageLoader } from "@/hooks/usePageLoader";
import LoadingScreen from "../layout/LoadingScreen";
import PageWrapper from "@/components/transition/PageWrapper";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sweepstakesApi } from "@/lib/api";
import { prefetchGames } from "@/lib/gamesCache";
import {
	prefetchParticipants,
	findParticipantByEmail,
	addCachedParticipant,
	getCachedParticipants,
} from "@/lib/participantsCache";
import { useRouter } from "next/navigation";

export default function GuestCup() {
	const bgImage = "/img/guest-cup.svg";
	const router = useRouter();

	const loading = usePageLoader(bgImage);

	const [email, setEmail] = useState("");
	const [name, setName] = useState("");

	const [isExisting, setIsExisting] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const [participantsReady, setParticipantsReady] = useState(false);

	const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
	const showNameField = emailIsValid && !isExisting;

	const canSubmit = isExisting
		? emailIsValid && !submitting
		: emailIsValid && name.trim().length > 1 && !submitting;

	useEffect(() => {
		prefetchGames().catch((error) => {
			console.error("Erro ao pré-carregar jogos:", error);
		});

		let cancelled = false;
		prefetchParticipants()
			.then(() => {
				if (!cancelled) setParticipantsReady(true);
			})
			.catch((error) => {
				console.error("Erro ao pré-carregar participantes:", error);
				if (!cancelled) setParticipantsReady(true);
			});

		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		if (!emailIsValid) {
			setIsExisting(false);
			setName("");
			return;
		}

		const found = findParticipantByEmail(email);
		if (found) {
			setIsExisting(true);
			setName(found.name);
		} else {
			setIsExisting(false);
			setName("");
		}
	}, [email, emailIsValid, participantsReady]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!canSubmit) return;

		const targetEmail = email.trim().toLowerCase();
		const targetHandle = name.trim();

		const allParticipants = getCachedParticipants() || [];
		const instagramConflict = allParticipants.find(
			(p) =>
				p.name.toLowerCase() === targetHandle.toLowerCase() &&
				p.email.toLowerCase() !== targetEmail,
		);

		if (instagramConflict) {
			toast.error("Ops! Este @ já está em uso", {
				description:
					"Este Instagram já está vinculado a outro e-mail. Se houver problemas, entre em contato.",
			});
			return;
		}

		setSubmitting(true);

		try {
			const response = await sweepstakesApi.registerParticipant(
				isExisting ? name : name.trim(),
				targetEmail,
			);

			if (response.success) {
				toast.success(
					isExisting
						? `Bem-vindo de volta, ${response.name}!`
						: "Cadastro realizado com sucesso!",
				);

				addCachedParticipant({
					email: targetEmail,
					name: response.name,
					created_at: new Date().toISOString(),
				});

				localStorage.setItem("guest_email", targetEmail);
				localStorage.setItem("guest_name", response.name);

				router.push("/guest-cup/dash");
			}
		} catch (error) {
			console.error("Erro na autenticação:", error);
			toast.error("Não foi possível processar a sua entrada.");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<PageWrapper>
			<AnimatePresence mode="wait">
				{loading && <LoadingScreen key="loader-guest-cup" />}
			</AnimatePresence>

			<main className="relative flex min-h-screen flex-col items-center justify-center overflow-y-auto bg-[#0b0a07] px-6 text-center custom-scrollbar">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 overflow-hidden"
				>
					<div className="absolute -top-32 left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-[#d4af37]/10 blur-[100px]" />
					{[...Array(12)].map((_, i) => (
						<motion.span
							key={i}
							className="absolute size-[3px] rounded-full bg-[#f4d67a]"
							style={{
								left: `${(i * 41) % 100}%`,
								top: `${(i * 59) % 100}%`,
							}}
							animate={{ opacity: [0.1, 0.7, 0.1], y: [0, -10, 0] }}
							transition={{
								duration: 4 + (i % 5),
								repeat: Infinity,
								delay: i * 0.3,
							}}
						/>
					))}
				</div>

				<div className="relative z-10 max-w-xl w-full flex flex-col items-center">
					<motion.div
						initial={{ opacity: 0, y: -12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="relative w-full max-w-sm"
					>
						<motion.div
							animate={{ y: [0, -8, 0] }}
							transition={{
								duration: 4,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						>
							<Image
								src="/img/guest-cup.png"
								alt="LFERREIRA - Copa dos Convidados"
								width={1024}
								height={1024}
								priority
								className="w-full h-auto opacity-80 drop-shadow-[0_8px_30px_rgba(212,175,55,0.25)]"
							/>
						</motion.div>
					</motion.div>

					<Card className="w-full max-w-md border-[#d4af37]/20 bg-neutral-900/60 text-left backdrop-blur-sm shadow-2xl shadow-black/50">
						<CardContent>
							<form onSubmit={handleSubmit} className="flex flex-col gap-4">
								<div className="flex flex-col gap-2">
									<Label htmlFor="email" className="text-neutral-300">
										E-mail
									</Label>
									<div className="relative">
										<Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
										<Input
											id="email"
											type="email"
											inputMode="email"
											placeholder="voce@email.com"
											className="pl-9 bg-neutral-950/60 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-[#d4af37]"
											value={email}
											onChange={(e) => setEmail(e.target.value.toLowerCase())}
											autoComplete="email"
											disabled={submitting}
										/>
									</div>
								</div>

								{showNameField && (
									<div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
										<Label htmlFor="name" className="text-neutral-300">
											Instagram
										</Label>
										<div className="relative flex items-center">
											<span className="absolute left-3 text-neutral-500 font-medium select-none">
												@
											</span>
											<Input
												id="name"
												placeholder="seuusuario"
												className="pl-8 bg-neutral-950/60 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-[#d4af37]"
												value={name}
												onChange={(e) =>
													setName(e.target.value.replace(/@/g, ""))
												}
												autoComplete="off"
												disabled={submitting}
											/>
										</div>
										<p className="text-[11px] text-neutral-500 italic">
											Insira seu @ do Instagram. Entraremos em contato por lá
											caso você ganhe!
										</p>
									</div>
								)}

								<Button
									type="submit"
									size="lg"
									disabled={!canSubmit}
									className="mt-1 gap-2 bg-gradient-to-r from-[#f4d67a] to-[#d4af37] text-neutral-950 font-semibold hover:opacity-90 transition disabled:opacity-40"
								>
									{submitting ? (
										<Loader2 className="size-4 animate-spin" />
									) : isExisting ? (
										"Entrar no Painel"
									) : (
										"Criar Conta e Entrar"
									)}
									{!submitting && <ArrowRight className="size-4" />}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</main>
		</PageWrapper>
	);
}
