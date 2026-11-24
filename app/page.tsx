import { FaDiscord, FaGithub, FaInstagram, FaSoundcloud, FaSpotify, FaYoutube } from "react-icons/fa";
import Sky from "./sky";

const LINKS = [
	[
		[FaGithub, "https://github.com/NicholasC2"],
		[FaInstagram, "https://instagram.com/nicholasc.died"],
		[FaDiscord, "https://discordapp.com/users/nick.c_"],
	],
	[
		[FaYoutube, "https://youtube.com/@nicholasc404"],
		[FaSpotify, "https://open.spotify.com/user/31myoemelk2vzmcth5qvg64hpslq"],
		[FaSoundcloud, "https://soundcloud.com/deziner_cutzz"],
	],
] as const;

export default function Home() {
	return (
		<>
			<Sky />
			<div className="grain" />
			<nav className="links">
				{LINKS.map((row, i) => (
					<div key={i} className="link-row">
						{row.map(([Icon, href]) => (
							<a key={href} href={href} target="_blank" rel="noopener noreferrer">
								<Icon size={24} />
							</a>
						))}
					</div>
				))}
			</nav>
		</>
	);
}
