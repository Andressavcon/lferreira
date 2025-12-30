"use client";
import Image from "next/image";

export default function Logo({ onClick }: { onClick?: () => void }) {
	return (
		<button
			onClick={onClick}
			aria-label="Ir para home"
			className="flex items-center transition-opacity hover:opacity-80"
		>
			<div className="relative w-32 md:w-40">
				<Image
					src="/img/logo/lferreira.svg"
					alt="LFerreira"
					width={160} 
					height={40} 
					className="w-full h-auto" 
					priority
				/>
			</div>
		</button>
	);
}
