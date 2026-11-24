"use client";

import { useEffect, useRef } from "react";

const PIXEL_H = 120;
const FPS = 18;
const SUN_X = 0.68;
const SUN_Y = 0.33;
const SUN_SIZE = 0.3;
const HORIZON = 0.8;
const GRAIN_FRAMES = 6;
const EXPOSURE = 0.85;

const SPIKES: [number, number, number][] = [
    [Math.PI / 4, 0.75, 1],
    [(3 * Math.PI) / 4, 0.75, 1],
    [(-3 * Math.PI) / 4, 0.85, 0.9],
    [-Math.PI / 4, 0.7, 0.8],
    [Math.PI / 2, 0.55, 1],
    [-Math.PI / 2, 0.35, 0.35],
];

interface Pine {
    x: number;
    baseY: number;
    H: number;
    widths: number[];
    droops: number[];
    sway: number;
}

interface Star {
    x: number;
    y: number;
    ph: number;
    sp: number;
    b: number;
}

const sunRadius = (w: number, h: number) => (Math.min(w, h) * SUN_SIZE) / 2;

const gust = (t: number) =>
    0.55 + 0.32 * Math.sin(t * 0.5) + 0.22 * Math.sin(t * 1.17 + 1.7) + 0.1 * Math.sin(t * 2.9 + 0.4);

function mulberry32(seed: number) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function canvas2d(w: number, h: number) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return [c, c.getContext("2d")!] as const;
}

function buildPines(w: number, h: number): Pine[] {
    const rand = mulberry32(42);
    const out: Pine[] = [];
    const mk = (x: number, baseY: number, H: number, sway: number) => {
        const tiers = 8 + Math.floor(rand() * 5);
        const widths: number[] = [];
        const droops: number[] = [];
        for (let i = 0; i < tiers; i++) {
            widths.push(0.8 + rand() * 0.45);
            droops.push(0.15 + rand() * 0.35);
        }
        out.push({ x, baseY, H, widths, droops, sway });
    };

    const nf = Math.round(w / 7);
    for (let i = 0; i < nf; i++) mk((i + rand() * 0.8) * (w / nf), h * 0.9, h * (0.22 + rand() * 0.2), 0.05);

    const nm = Math.round(w / 12);
    for (let i = 0; i < nm; i++) mk((i + rand() * 0.8) * (w / nm), h * 0.97, h * (0.35 + rand() * 0.25), 0.07);

    const nn = Math.max(3, Math.round(w / 30));
    for (let i = 0; i < nn; i++) {
        const x = rand() < 0.5 ? rand() * w * 0.28 : w * (0.72 + rand() * 0.28);
        mk(x, h * 1.02, h * (0.6 + rand() * 0.35), 0.09);
    }
    return out;
}

function drawPine(ctx: CanvasRenderingContext2D, p: Pine, t: number, g: number) {
    const n = p.widths.length;
    const topY = p.baseY - p.H;
    const half = p.H * 0.2;
    const step = (p.H * 0.88) / n;
    const trunkW = Math.max(0.6, p.H * 0.02);
    const lean = (g * 0.9 + Math.sin(t * 0.9 + p.x * 0.7) * 0.3) * p.H * p.sway * 2.2;
    const at = (dx: number, y: number) => {
        const f = (p.baseY - y) / p.H;
        ctx.lineTo(p.x + dx + lean * f * f, y);
    };

    ctx.moveTo(p.x + lean, topY);
    for (let i = 0; i < n; i++) {
        const yi = topY + step * (i + 0.5);
        const wd = half * ((i + 1) / n) * p.widths[i];
        at(wd, yi + step * p.droops[i]);
        at(wd * 0.4, yi + step * 0.05);
    }
    at(trunkW, p.baseY);
    at(-trunkW, p.baseY);
    for (let i = n - 1; i >= 0; i--) {
        const yi = topY + step * (i + 0.5);
        const wd = half * ((i + 1) / n) * p.widths[i];
        at(-wd * 0.4, yi + step * 0.05);
        at(-wd, yi + step * p.droops[i]);
    }
    ctx.closePath();
}

function drawSpikes(ctx: CanvasRenderingContext2D) {
    const { width: W, height: H } = ctx.canvas;
    const sx = W * SUN_X;
    const sy = H * SUN_Y;
    const sr = sunRadius(W, H);
    const reach = Math.hypot(W, H);
    const d0 = sr * 0.55;
    const steps = 24;

    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = EXPOSURE;
    const glow = ctx.createRadialGradient(sx, sy, sr * 0.5, sx, sy, sr * 1.5);
    glow.addColorStop(0, "rgba(255,248,225,0.5)");
    glow.addColorStop(1, "rgba(255,220,150,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    const ray = (ang: number, L: number, w0: number, alpha: number) => {
        const cx = Math.cos(ang);
        const cy = Math.sin(ang);
        const x0 = sx + cx * d0;
        const y0 = sy + cy * d0;
        const edge = (sr - d0) / L;
        const grad = ctx.createLinearGradient(x0, y0, x0 + cx * L, y0 + cy * L);
        grad.addColorStop(0, `rgba(255,250,235,${alpha})`);
        grad.addColorStop(edge, `rgba(255,245,215,${alpha})`);
        for (let k = 1; k <= 6; k++) {
            grad.addColorStop(edge + (1 - edge) * (k / 6), `rgba(255,225,160,${alpha * Math.exp(-(k / 6) * 3.5)})`);
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        for (let k = -steps; k <= steps; k++) {
            const f = Math.abs(k) / steps;
            const d = f * L;
            const hw = w0 * Math.pow(1 - f, 1.5) * (k < 0 ? 1 : -1);
            ctx.lineTo(x0 + cx * d - cy * hw, y0 + cy * d + cx * hw);
        }
        ctx.fill();
    };

    for (const [ang, len, strength] of SPIKES) {
        ctx.filter = `blur(${Math.max(1, sr * 0.04)}px)`;
        ray(ang, reach * len, sr * 0.09, strength * 0.35);
        ctx.filter = "none";
        ray(ang, reach * len, Math.max(1, sr * 0.025), strength);
    }
}

function renderGrain(w: number, h: number) {
    return Array.from({ length: GRAIN_FRAMES }, () => {
        const [c, ctx] = canvas2d(w, h);
        const img = ctx.createImageData(w, h);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
            d[i] = d[i + 1] = d[i + 2] = Math.random() * 255;
            d[i + 3] = 18 + Math.random() * 42;
        }
        ctx.putImageData(img, 0, 0);
        return c;
    });
}

export default function Sky() {
    const skyRef = useRef<HTMLCanvasElement>(null);
    const spikeRef = useRef<HTMLCanvasElement>(null);
    const grainRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const ctx = skyRef.current!.getContext("2d")!;
        const sctx = spikeRef.current!.getContext("2d")!;
        const gctx = grainRef.current!.getContext("2d")!;
        const [buf, bctx] = canvas2d(1, 1);

        let w = 0;
        let h = 0;
        let sky: CanvasGradient;
        let bloom: CanvasGradient;
        let hills: Path2D;
        let pines: Pine[] = [];
        let stars: Star[] = [];
        let grain: HTMLCanvasElement[] = [];

        const setup = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            w = Math.max(40, Math.round((PIXEL_H * vw) / Math.max(1, vh)));
            h = PIXEL_H;
            ctx.canvas.width = gctx.canvas.width = buf.width = w;
            ctx.canvas.height = gctx.canvas.height = buf.height = h;
            sctx.canvas.width = Math.round(vw / 2);
            sctx.canvas.height = Math.round(vh / 2);

            sky = bctx.createLinearGradient(0, 0, 0, h * HORIZON);
            sky.addColorStop(0, "#1b2030");
            sky.addColorStop(0.4, "#4a5266");
            sky.addColorStop(0.75, "#9ea3a6");
            sky.addColorStop(1, "#e9d3ae");

            const sx = w * SUN_X;
            const sy = h * SUN_Y;
            const sr = sunRadius(w, h);
            bloom = bctx.createRadialGradient(sx, sy, sr * 0.6, sx, sy, sr * 4);
            bloom.addColorStop(0, "rgba(255,235,170,0.85)");
            bloom.addColorStop(0.2, "rgba(245,200,120,0.5)");
            bloom.addColorStop(0.55, "rgba(190,145,105,0.15)");
            bloom.addColorStop(1, "rgba(150,120,100,0)");

            const rand = mulberry32(11);
            const p1 = rand() * 6;
            const p2 = rand() * 6;
            hills = new Path2D();
            hills.moveTo(0, h);
            for (let x = 0; x <= w; x++) {
                hills.lineTo(x, h * HORIZON - h * (0.025 + 0.02 * Math.sin(x * 0.03 + p1) + 0.012 * Math.sin(x * 0.11 + p2)));
            }
            hills.lineTo(w, h);

            pines = buildPines(w, h);
            stars = Array.from({ length: Math.round((w * h) / 80) }, () => ({
                x: Math.floor(rand() * w),
                y: Math.floor(rand() * h * 0.4),
                ph: rand() * 6.28,
                sp: 0.5 + rand() * 2.5,
                b: 0.3 + rand() * 0.7,
            }));

            grain = renderGrain(w, h);
            drawSpikes(sctx);
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, w, h);
        };

        const frame = (t: number) => {
            const g = gust(t);
            const sx = w * SUN_X;
            const sy = h * SUN_Y;
            const sr = sunRadius(w, h);

            bctx.fillStyle = sky;
            bctx.fillRect(0, 0, w, h);

            bctx.fillStyle = "rgb(255,250,240)";
            for (const s of stars) {
                bctx.globalAlpha = s.b * (1 - s.y / (h * 0.4)) * (0.2 + 0.3 * (1 + Math.sin(t * s.sp + s.ph)));
                bctx.fillRect(s.x, s.y, 1, 1);
            }

            bctx.globalCompositeOperation = "lighter";
            bctx.globalAlpha = EXPOSURE;
            bctx.fillStyle = bloom;
            bctx.fillRect(0, 0, w, h);
            bctx.globalCompositeOperation = "source-over";
            bctx.globalAlpha = 1;

            bctx.fillStyle = "#0b0a0c";
            bctx.fill(hills);
            bctx.fillStyle = "#000";
            bctx.beginPath();
            for (const p of pines) drawPine(bctx, p, t, g);
            bctx.fill();

            for (let k = 0; k < 5; k++) {
                const bx = sx + Math.cos(k * 1.9 + t * 0.3) * sr * 0.12;
                const by = sy + Math.sin(k * 2.7 + t * 0.25) * sr * 0.1;
                const br = sr * (0.8 + 0.15 * Math.sin(k * 3.1 + t * 0.4));
                const blob = bctx.createRadialGradient(bx, by, 0, bx, by, br);
                blob.addColorStop(0, "rgba(255,255,252,1)");
                blob.addColorStop(0.65, "rgba(255,252,240,0.95)");
                blob.addColorStop(1, "rgba(255,240,200,0)");
                bctx.fillStyle = blob;
                bctx.beginPath();
                bctx.arc(bx, by, br, 0, Math.PI * 2);
                bctx.fill();
            }

            const z = 1.08 + 0.04 * Math.sin(t * 0.21);
            ctx.globalAlpha = 0.4;
            ctx.drawImage(buf, 0, 0);
            ctx.globalAlpha = 0.16;
            ctx.drawImage(
                buf,
                (w - w * z) / 2 + Math.sin(t * 0.17) * w * 0.06,
                (h - h * z) / 2 + Math.cos(t * 0.13) * h * 0.03,
                w * z,
                h * z
            );
            ctx.globalAlpha = 1;

            gctx.clearRect(0, 0, w, h);
            gctx.drawImage(grain[(Math.random() * GRAIN_FRAMES) | 0], 0, 0);
        };

        setup();
        let resizeTimer = 0;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(setup, 150);
        };
        window.addEventListener("resize", onResize);

        let raf = 0;
        let last = performance.now();
        let t = 0;
        const tick = (now: number) => {
            raf = requestAnimationFrame(tick);
            const d = now - last;
            if (d < 1000 / FPS) return;
            last = now - (d % (1000 / FPS));
            t += Math.min(d, 250) / 1000;
            frame(t);
        };
        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(resizeTimer);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <div className="scene">
            <canvas ref={skyRef} />
            <canvas ref={spikeRef} className="spikes" />
            <canvas ref={grainRef} />
        </div>
    );
}
