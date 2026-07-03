"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, Lock, Target, Timer, XCircle } from "lucide-react";

export function GameStatusBadge({
	isFinished,
	isLocked = false,
}: {
	isFinished: boolean;
	isLocked?: boolean;
}) {
	if (isFinished) {
		return (
			<Badge
				variant="outline"
				className="gap-1 border-neutral-800 bg-neutral-950/40 text-neutral-400"
			>
				<CheckCircle2 className="size-3.5" />
				Finalizado
			</Badge>
		);
	}

	if (isLocked) {
		return (
			<Badge
				variant="outline"
				className="gap-1 border-neutral-800 bg-neutral-950/40 text-neutral-400"
			>
				<Lock className="size-3.5" />
				Apostas Encerradas
			</Badge>
		);
	}

	return (
		<Badge className="gap-1 border-transparent bg-[#d4af37]/10 text-[#f4d67a] hover:bg-[#d4af37]/20">
			<Timer className="size-3.5" />
			Aberto para Palpites
		</Badge>
	);
}

const OUTCOME_MAP = {
	exact: {
		label: "Acertou o Placar",
		icon: Target,
		className:
			"border-transparent bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
	},
	winner: {
		label: "Acertou o Vencedor",
		icon: CheckCircle2,
		className:
			"border-transparent bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
	},
	miss: {
		label: "Errou o Palpite",
		icon: XCircle,
		className:
			"border-transparent bg-rose-500/10 text-rose-400 border border-rose-500/20",
	},
} as const;

export function OutcomeBadge({
	outcome,
	className,
}: {
	outcome: "exact" | "winner" | "miss";
	className?: string;
}) {
	const cfg = OUTCOME_MAP[outcome];
	const Icon = cfg.icon;
	return (
		<Badge className={cn("gap-1 font-medium", cfg.className, className)}>
			<Icon className="size-3.5" />
			{cfg.label}
		</Badge>
	);
}
