interface Video {
	id: string;
	title: string;
	thumbnail: string;
	youtubeUrl: string;
	date: string;
	description?: string;
}

export const videos: Video[] = [
	{
		id: "1",
		title: "LFERREIRA & Convidados",
		thumbnail: "/img/set01.jpeg",
		youtubeUrl: "https://www.youtube.com/watch?v=F1pv8BuNhHQ",
		date: "06.2022",
		description: "SET AO VIVO @ Engenho (Pelotas/RS) ",
	},
	{
		id: "2",
		title: "The journey of a thousand miles #01",
		thumbnail: "/img/set02.jpg",
		youtubeUrl: "https://www.youtube.com/watch?v=Cu0vKVyo1CI",
		date: "04.2021",
		description: "",
	},
	{
		id: "3",
		title: "ATL DJ WEEKEND [100% AUTORAL]",
		thumbnail: "/img/set03.png",
		youtubeUrl: "https://www.youtube.com/watch?v=RsAV4uV_mgw",
		date: "02.2021",
		description: "Rádio Atlântida ",
	},
	{
		id: "4",
		title: " SIXX HOUSE",
		thumbnail: "/img/set04.png",
		youtubeUrl: "https://www.youtube.com/watch?v=IxxHwH2inds&t=570s",
		date: "11.2024",
		description: "SÃO JOSE/ SC",
	},
];
