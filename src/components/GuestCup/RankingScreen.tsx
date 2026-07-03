"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, Crown, Medal } from "lucide-react";
import { motion } from "framer-motion";

export interface Participant {
	id: string | number;
	name: string;
	points: number;
	isCurrentUser?: boolean;
}

const PODIUM_STYLES = [
	{
		ring: "border-[#d4af37] bg-neutral-900/80 shadow-lg shadow-[#d4af37]/5",
		badge: "bg-[#d4af37]/10 text-[#f4d67a] border border-[#d4af37]/20",
		icon: "text-[#d4af37]",
		order: "order-1 sm:order-2 sm:-mt-6 border-2",
	},
	{
		ring: "border-neutral-700 bg-neutral-900/40",
		badge: "bg-neutral-800 text-neutral-300",
		icon: "text-neutral-400",
		order: "order-2 sm:order-1",
	},
	{
		ring: "border-amber-800/60 bg-neutral-900/40",
		badge: "bg-amber-950/40 text-amber-500",
		icon: "text-amber-700",
		order: "order-3",
	},
];

const PODIUM_PRIZES = ["1º Lugar", "2º Lugar", "3º Lugar"];

function initials(name: string) {
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((p) => p[0])
		.join("")
		.toUpperCase();
}

function PodiumCard({
	participant,
	position,
}: {
	participant: Participant;
	position: number;
}) {
	const style = PODIUM_STYLES[position - 1];
	if (!participant) return null;

	return (
		<Card
			className={cn(
				"flex h-full flex-col items-center gap-2 p-6 text-center border transition-all",
				style.ring,
				participant.isCurrentUser && "bg-[#d4af37]/5 border-[#d4af37]/40",
			)}
		>
			{position === 1 ? (
				<Crown className="size-7 text-[#d4af37]" />
			) : (
				<Medal className={cn("size-6", style.icon)} />
			)}
			<div
				className={cn(
					"flex size-12 items-center justify-center rounded-full text-xs font-bold tracking-wider select-none",
					style.badge,
				)}
			>
				{initials(participant.name)}
			</div>
			<div className="w-full">
				<p className="text-sm font-bold text-neutral-100 truncate max-w-[140px] mx-auto">
					{participant.name}
					{participant.isCurrentUser && (
						<span className="ml-1 text-[10px] font-normal text-[#f4d67a] block sm:inline">
							(você)
						</span>
					)}
				</p>
				<p className="font-mono text-xl font-black tabular-nums text-neutral-50 mt-1">
					{participant.points}
					<span className="ml-1 text-xs font-normal text-neutral-400">pts</span>
				</p>
			</div>
			<span
				className={cn(
					"mt-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider select-none",
					style.badge,
				)}
			>
				{PODIUM_PRIZES[position - 1]}
			</span>
		</Card>
	);
}

export function RankingScreen({
	participants,
	onBack,
}: {
	participants: Participant[];
	onBack: () => void;
}) {
	const currentUserRef = useRef<HTMLDivElement | null>(null);

	const sorted = [...participants].sort((a, b) => b.points - a.points);

	const podium = [
		{ p: sorted[0], pos: 1 },
		{ p: sorted[1], pos: 2 },
		{ p: sorted[2], pos: 3 },
	].filter((item) => item.p);

	const rest = sorted.slice(3);

	useEffect(() => {
		if (currentUserRef.current) {
			currentUserRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
	}, []);

	return (
		<div className="min-h-screen bg-[#0b0a07] text-neutral-100 relative">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute top-0 left-1/2 size-[500px] -translate-x-1/2 rounded-full bg-[#d4af37]/5 blur-3xl"
			/>

			<header className="border-b border-neutral-800 bg-neutral-900/40 backdrop-blur relative z-10">
				<div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5">
					<Button
						variant="outline"
						size="icon"
						onClick={onBack}
						aria-label="Voltar ao painel"
						className="border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:bg-neutral-800"
					>
						<ArrowLeft className="size-4" />
					</Button>
					<div>
						<h1 className="text-lg font-bold bg-gradient-to-r from-[#f4d67a] to-[#d4af37] bg-clip-text text-transparent">
							Ranking Geral
						</h1>
						<p className="text-xs text-neutral-400">
							Veja quem está na liderança da Copa dos Convidados.
						</p>
					</div>
				</div>
			</header>

			<section className="mx-auto max-w-3xl px-4 py-8 relative z-10">
				{podium.length > 0 && (
					<motion.div
						initial="hidden"
						animate="show"
						variants={{
							hidden: {},
							show: {
								transition: { staggerChildren: 0.12, delayChildren: 0.1 },
							},
						}}
						className="mb-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-end pt-6"
					>
						{podium.map((item) => (
							<motion.div
								key={item.p.id}
								variants={{
									hidden: { opacity: 0, y: 24, scale: 0.95 },
									show: { opacity: 1, y: 0, scale: 1 },
								}}
								transition={{ duration: 0.4, ease: "easeOut" }}
								className={cn("flex-1", PODIUM_STYLES[item.pos - 1].order)}
							>
								<PodiumCard participant={item.p} position={item.pos} />
							</motion.div>
						))}
					</motion.div>
				)}

				<motion.div
					initial="hidden"
					animate="show"
					variants={{
						hidden: {},
						show: {
							transition: { staggerChildren: 0.05, delayChildren: 0.4 },
						},
					}}
					className="flex flex-col gap-2"
				>
					{rest.map((p, i) => (
						<motion.div
							key={p.id}
							ref={p.isCurrentUser ? currentUserRef : undefined}
							variants={{
								hidden: { opacity: 0, x: -16 },
								show: { opacity: 1, x: 0 },
							}}
							transition={{ duration: 0.3, ease: "easeOut" }}
							className={cn(
								"flex items-center gap-3 rounded-xl border px-4 py-3 transition-all",
								p.isCurrentUser
									? "border-neutral-700 bg-neutral-900/40"
									: "border-neutral-800 bg-neutral-900/20 hover:bg-neutral-900/40",
							)}
						>
							<span className="w-6 text-center font-mono text-xs font-bold text-neutral-500 tabular-nums">
								{i + 4}
							</span>
							<div className="flex size-9 items-center justify-center rounded-full bg-neutral-950/60 border border-neutral-800 text-xs font-bold text-neutral-400 select-none">
								{initials(p.name)}
							</div>
							<span className="flex-1 truncate text-sm font-semibold text-neutral-200">
								{p.name}
								{p.isCurrentUser && (
									<span className="ml-1 text-xs font-normal text-neutral-500">
										(você)
									</span>
								)}
							</span>
							<span className="font-mono text-sm font-bold tabular-nums text-neutral-100">
								{p.points}
								<span className="ml-1 text-[10px] font-normal text-neutral-500">
									pts
								</span>
							</span>
						</motion.div>
					))}
				</motion.div>
			</section>
		</div>
	);
}
