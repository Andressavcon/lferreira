import { useState, useEffect } from "react";

export function usePageLoader(imageSrc: string) {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		document.body.style.overflow = "hidden";

		const img = new (window as Window & typeof globalThis).Image();
		img.src = imageSrc;

		const handleLoadComplete = () => {
			setTimeout(() => {
				setLoading(false);
				document.body.style.overflow = "auto";
			}, 1200);
		};

		img.onload = handleLoadComplete;
		img.onerror = handleLoadComplete;

		return () => {
			document.body.style.overflow = "auto";
		};
	}, [imageSrc]);

	return loading;
}
