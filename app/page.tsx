"use client";

import { useEffect, useRef } from "react";
import { FaDiscord, FaGithub, FaInstagram, FaSpotify, FaYoutube, FaSoundcloud } from "react-icons/fa";
import SocialLink from "./link";
import Logo from "./logo.png";
import Image from "next/image";

export default function Home() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const context = canvas.getContext("2d");
		if (!context) return;

		const fontSize = 16;
		const dpr = window.devicePixelRatio || 1;

		canvas.width = canvas.clientWidth * dpr;
		canvas.height = canvas.clientHeight * dpr;

		context.scale(dpr, dpr);

		const width = canvas.clientWidth;
		const height = canvas.clientHeight;

		const ascii = `!@#$%^&*()_+-=[]{}|;:',.<>/?\\
~\`"€
§±×÷
■□▪▫●○◆◇
▲△▼▽◀▶◁▷
←→↑↓↔↕↖↗↘↙
∞≈≠≤≥
∑∏√∫
αβγδεζηθικλμνξοπρστυφχψω
ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ`;

		class Character {
			x: number;
			y: number;

			constructor(x: number) {
				this.x = x;
				this.y = Math.random() * -50;
			}

			update() {
				this.y += 1;

				if (this.y > height / fontSize || Math.random() > 0.98) {
					this.y = 0;
				}
			}

			draw() {
				const char = ascii[Math.floor(Math.random() * ascii.length)];

				context!.fillStyle = "lime";
				context!.fillText(char, this.x * fontSize, this.y * fontSize);
			}
		}

		const characters: Character[] = [];

		function loop() {
			context!.fillStyle = "rgba(0, 0, 0, 0.15)";
			context!.fillRect(0, 0, width, height);
			context!.font = `${fontSize}px monospace`;

			const columns = Math.floor(width / fontSize);

			while (characters.length < columns) {
				characters.push(new Character(characters.length));
			}

			while (characters.length > columns) {
				characters.pop();
			}

			for (const char of characters) {
				char.update();
				char.draw();
			}
		}

		for (let i = 0; i < 30; i++) {
			loop();
		}

		const interval = window.setInterval(loop, 160);

		return () => window.clearInterval(interval);
	}, []);

	return (
		<>
			<div className="bio">
				<Image className="logo" src={Logo} alt="" />

				<div className="socials">
					<SocialLink icon={FaGithub} href="https://github.com/NicholasC2" name="github" />
					<SocialLink icon={FaInstagram} href="https://instagram.com/nicholasc.died" name="instagram" />
					<SocialLink icon={FaDiscord} href="https://discordapp.com/users/nick.c_" name="discord" />
					<SocialLink icon={FaYoutube} href="https://youtube.com/@nicholasc404" name="youtube" />
					<SocialLink icon={FaSpotify} href="https://open.spotify.com/user/31myoemelk2vzmcth5qvg64hpslq" name="spotify" />
					<SocialLink icon={FaSoundcloud} href="https://soundcloud.com/deziner_cutzz" name="soundcloud" />
				</div>
			</div>

			<canvas ref={canvasRef} className="matrix-canvas" />
		</>
	);
}
