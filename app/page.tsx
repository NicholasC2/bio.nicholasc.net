"use client";

import { useEffect, useRef } from "react";
import { FaDiscord, FaGithub, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";

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

        if (
          this.y > height / fontSize ||
          Math.random() > 0.98
        ) {
          this.y = 0;
        }
      }

      draw() {
        const char =
          ascii[Math.floor(Math.random() * ascii.length)];

        context!.fillStyle = "lime";
        context!.fillText(
          char,
          this.x * fontSize,
          this.y * fontSize
        );
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
          <pre className="logo">
            {` ███▄    █  ██▓ ▄████▄   ██░ ██  ▒█████   ██▓    ▄▄▄        ██████  ▄████▄        ███▄    █ ▓█████▄▄▄█████▓
 ██ ▀█   █ ▓██▒▒██▀ ▀█  ▓██░ ██▒▒██▒  ██▒▓██▒   ▒████▄    ▒██    ▒ ▒██▀ ▀█        ██ ▀█   █ ▓█   ▀▓  ██▒ ▓▒
▓██  ▀█ ██▒▒██▒▒▓█    ▄ ▒██▀▀██░▒██░  ██▒▒██░   ▒██  ▀█▄  ░ ▓██▄   ▒▓█    ▄      ▓██  ▀█ ██▒▒███  ▒ ▓██░ ▒░
▓██▒  ▐▌██▒░██░▒▓▓▄ ▄██▒░▓█ ░██ ▒██   ██░▒██░   ░██▄▄▄▄██   ▒   ██▒▒▓▓▄ ▄██▒     ▓██▒  ▐▌██▒▒▓█  ▄░ ▓██▓ ░ 
▒██░   ▓██░░██░▒ ▓███▀ ░░▓█▒░██▓░ ████▓▒░░██████▒▓█   ▓██▒▒██████▒▒▒ ▓███▀ ░ ██▓ ▒██░   ▓██░░▒████▒ ▒██▒ ░ 
░ ▒░   ▒ ▒ ░▓  ░ ░▒ ▒  ░ ▒ ░░▒░▒░ ▒░▒░▒░ ░ ▒░▓  ░▒▒   ▓▒█░▒ ▒▓▒ ▒ ░░ ░▒ ▒  ░ ▒▓▒ ░ ▒░   ▒ ▒ ░░ ▒░ ░ ▒ ░░   
░ ░░   ░ ▒░ ▒ ░  ░  ▒    ▒ ░▒░ ░  ░ ▒ ▒░ ░ ░ ▒  ░ ▒   ▒▒ ░░ ░▒  ░ ░  ░  ▒    ░▒  ░ ░░   ░ ▒░ ░ ░  ░   ░    
   ░   ░ ░  ▒ ░░         ░  ░░ ░░ ░ ░ ▒    ░ ░    ░   ▒   ░  ░  ░  ░         ░      ░   ░ ░    ░    ░      
         ░  ░  ░ ░       ░  ░  ░    ░ ░      ░  ░     ░  ░      ░  ░ ░        ░           ░    ░  ░        
               ░                                                   ░          ░                            `}
          </pre>
          <div className="socials">
              <a href="https://github.com/NicholasC2" target="_blank">
                <FaGithub size={"100%"} />
              </a>
              <a href="https://instagram.com/nicholasc.died" target="_blank">
                <FaInstagram size={"100%"} />
              </a>
              <a href="https://discordapp.com/users/nick.c_" target="_blank">
                <FaDiscord size={"100%"} />
              </a>
              <a href="https://youtube.com/@nicholasc404" target="_blank">
                <FaYoutube size={"100%"} />
              </a>
              <a href="https://open.spotify.com/user/31myoemelk2vzmcth5qvg64hpslq" target="_blank">
                <FaSpotify size={"100%"} />
              </a>
          </div>
      </div>

      <canvas ref={canvasRef} className="matrix-canvas" />
    </>
  );
}
