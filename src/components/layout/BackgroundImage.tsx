"use client";

import Image from "next/image";
import clsx from "clsx";

interface BackgroundImageProps {
	src: string;
	imageOpacity?: number;
	overlayOpacity?: number;
	fixed?: boolean;
	className?: string;
	priority?: boolean;
	objectPosition?: string; 
}

export default function BackgroundImage({
	src,
	imageOpacity = 0.2,
	overlayOpacity = 0.4,
	fixed = true,
	className,
	priority = true,
	objectPosition = "center center", 
}: BackgroundImageProps) {
	return (
		<div
			className={clsx(
				fixed ? "fixed inset-0" : "absolute inset-0",
				"z-0 overflow-hidden",
				className
			)}
		>
			<div
				className="relative w-full h-full transition-opacity duration-1000"
				style={{ opacity: imageOpacity }}
			>
				<Image
					src={src}
					alt="Background"
					fill
					priority={priority}
					className="object-cover"
					style={{ objectPosition: objectPosition }}
					sizes="100vw"
					quality={85}
				/>
			</div>
			<div
				className="absolute inset-0 bg-black pointer-events-none"
				style={{ opacity: overlayOpacity }}
			/>
		</div>
	);
}
