export interface MusicItem {
	id: number;
	title: string;
	description: string;
	image: string;
	links: {
		spotify?: string;
		youtube?: string;
		deezer?: string;
		apple?: string;
	};
}

export const musicData: MusicItem[] = [
	{
		id: 1,
		title: "Coffee Date",
		description: "description1",
		image: "/music/coffee.jpg",
		links: {
			spotify:
				"https://open.spotify.com/intl-pt/track/3MlkLTxuClFvq0DHcz86ho?si=9ef7cac576144b03",
			youtube: "https://www.youtube.com/watch?v=E7ivxhoV04g",
			deezer: "https://link.deezer.com/s/321cgpVNn7WL45ADTN65c",
			apple: "https://music.apple.com/br/album/coffee-date-single/1851217642",
		},
	},
	{
		id: 2,
		title: "Voyage, voyage",
		description: "description2",
		image: "/music/voyage.jpg",
		links: {
			spotify:
				"https://open.spotify.com/intl-pt/track/2TWeCnVRYbZPK27ZdCUslQ?si=12885e53a44147d6",
			youtube: "https://www.youtube.com/watch?v=JbYt5nzMPQE",
			deezer: "https://link.deezer.com/s/321cg0iFO9xwUBaBcQeVe",
			apple:
				"https://music.apple.com/br/album/voyage-voyage-feat-lucas-belgrado-single/1574869416",
		},
	},
	{
		id: 3,
		title: "Quem Não Quer Sou Eu (Official Remix)",
		description: "description3",
		image: "/music/quem-nao-quer-sou-eu.jpg",
		links: {
			spotify:
				"https://open.spotify.com/intl-pt/track/6UiROgRT3ElcYoqcjpxLUY?si=7d71fc7fbe1d416f",
			youtube: "https://www.youtube.com/watch?v=Lm25vnoC9CY",
			deezer: "https://link.deezer.com/s/321cfzzO7HRk6LWMrfvkw",
			apple:
				"https://music.apple.com/br/album/quem-n%C3%A3o-quer-sou-eu-remix-single/1772951149",
		},
	},
	{
		id: 4,
		title: "Dimensions ",
		description: "description4",
		image: "/music/dimensions.jpg",
		links: {
			spotify:
				"https://open.spotify.com/intl-pt/track/6iEPIf0wfDQIG5D7pepPuo?si=2113bc54507d425c",
			youtube: "https://www.youtube.com/watch?v=waYYxX_AuBg",
			deezer: "https://link.deezer.com/s/321cgPdLstg9WUEj5QpIS",
			apple: "https://music.apple.com/br/album/dimensions-single/1811406793",
		},
	},
];
