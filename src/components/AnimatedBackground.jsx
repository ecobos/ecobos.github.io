import { useEffect, useRef } from "react";
import "./AnimatedBackground.css";

function lerp(a, b, t) { return a + (b - a) * t; }

// ── Shape primitives ─────────────────────────────────────────────────────────

// Pill / stadium path (vertical by default, use rot to orient)
function pillPath(ctx, w, h) {
  const r = w / 2;
  const half = (h - w) / 2;
  ctx.beginPath();
  ctx.arc(0, -half, r, Math.PI, 0, false);   // top cap
  ctx.lineTo(r, half);
  ctx.arc(0,  half, r, 0, Math.PI, false);   // bottom cap
  ctx.closePath();
}

function drawConcentricPills(ctx, cx, cy, w, h, rings, gap, rot, stroke, lw) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.strokeStyle = stroke;
  ctx.lineWidth   = lw;
  for (let i = 0; i < rings; i++) {
    const cw = w - i * gap * 2;
    const ch = h - i * gap * 2;
    if (cw < 4) break;
    pillPath(ctx, cw, ch);
    ctx.stroke();
  }
  ctx.restore();
}

function drawConcentricArcs(ctx, cx, cy, r, rings, gap, startA, endA, stroke, lw) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = stroke;
  ctx.lineWidth   = lw;
  for (let i = 0; i < rings; i++) {
    const cr = r - i * gap;
    if (cr <= 2) break;
    ctx.beginPath();
    ctx.arc(0, 0, cr, startA, endA, false);
    ctx.stroke();
  }
  ctx.restore();
}

function drawConcentricCircles(ctx, cx, cy, r, rings, gap, stroke, lw) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = stroke;
  ctx.lineWidth   = lw;
  for (let i = 0; i < rings; i++) {
    const cr = r - i * gap;
    if (cr <= 2) break;
    ctx.beginPath();
    ctx.arc(0, 0, cr, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// Filled pie wedge — startA/endA define the arc, rot rotates the whole shape
function drawFilledArc(ctx, cx, cy, r, startA, endA, rot, fill) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, r, startA, endA, false);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
}

// Two facing concentric arcs that form an S / reverse-S
function drawSCurves(ctx, cx, cy, r, rings, gap, rot, stroke, lw) {
  const off = r * 0.44;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.strokeStyle = stroke;
  ctx.lineWidth   = lw;
  for (let i = 0; i < rings; i++) {
    const cr = r - i * gap;
    if (cr <= 2) break;
    // Upper: right-facing C
    ctx.beginPath();
    ctx.arc(0, -off, cr, -Math.PI / 2, Math.PI / 2, false);
    ctx.stroke();
    // Lower: left-facing C
    ctx.beginPath();
    ctx.arc(0,  off, cr,  Math.PI / 2, -Math.PI / 2, false);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDot(ctx, cx, cy, r, fill) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

// ── Scene generation ─────────────────────────────────────────────────────────
// Called once per page load. Fixed zones ensure shapes spread across the
// viewport; shape type, size, and orientation are randomised within each zone.

function generateScene() {
  const rnd  = (lo, hi) => lo + Math.random() * (hi - lo);
  const pick = (...args) => args[Math.floor(Math.random() * args.length)];
  const ink  = (a) => `rgba(55,45,30,${a.toFixed(3)})`;
  const PI   = Math.PI;

  // Zones: base position + depth layer + size class
  const ZONES = [
    { x:.08, y:.24, depth:.005, cls:"large"  },
    { x:.88, y:.74, depth:.005, cls:"large"  },
    { x:.72, y:.20, depth:.018, cls:"medium" },
    { x:.28, y:.78, depth:.018, cls:"medium" },
    { x:.17, y:.52, depth:.018, cls:"medium" },
    { x:.54, y:.37, depth:.018, cls:"small"  },
    { x:.83, y:.44, depth:.018, cls:"small"  },
    { x:.76, y:.52, depth:.042, cls:"medium" },
    { x:.46, y:.14, depth:.042, cls:"medium" },
    { x:.62, y:.86, depth:.042, cls:"medium" },
    { x:.54, y:.62, depth:.042, cls:"medium" },
    { x:.24, y:.18, depth:.042, cls:"small"  },
  ];

  return ZONES.map((z) => {
    const x = z.x + rnd(-.04, .04);
    const y = z.y + rnd(-.04, .04);

    // Shape type pool per size class
    const type =
      z.cls === "large"  ? pick("pill", "arcs", "circles") :
      z.cls === "small"  ? pick("dot", "filled") :
      /* medium */         pick("pill", "arcs", "circles", "filled", "scurves");

    const baseR =
      z.cls === "large"  ? rnd(90, 130) :
      z.cls === "medium" ? rnd(55, 95)  : rnd(28, 55);

    const strokeA = rnd(.048, .068);
    const fillA   = rnd(.062, .082);
    const lw      = rnd(.8, 1.0);

    switch (type) {
      case "pill": {
        const w = baseR * rnd(.55, .85);
        return { t:"pill", depth:z.depth, x, y,
          w, h: w * rnd(2.0, 3.2),
          rings: Math.round(rnd(5, 9)), gap: rnd(7, 10),
          rot: rnd(0, PI * 2), stroke: ink(strokeA), lw };
      }
      case "arcs": {
        const startA = rnd(0, PI * 2);
        const span   = rnd(PI * .5, PI * 1.4);
        return { t:"arcs", depth:z.depth, x, y, r: baseR,
          rings: Math.round(rnd(5, 9)), gap: rnd(7, 10),
          startA, endA: startA + span, stroke: ink(strokeA), lw };
      }
      case "circles":
        return { t:"circles", depth:z.depth, x, y, r: baseR,
          rings: Math.round(rnd(4, 8)), gap: rnd(8, 12),
          stroke: ink(strokeA), lw };
      case "filled": {
        const startA = rnd(0, PI * 2);
        const span   = Math.random() > .5 ? PI : PI / 2;
        return { t:"filled", depth:z.depth, x, y, r: baseR,
          startA, endA: startA + span, rot: 0, fill: ink(fillA) };
      }
      case "scurves":
        return { t:"scurves", depth:z.depth, x, y, r: baseR,
          rings: Math.round(rnd(3, 5)), gap: rnd(8, 11),
          rot: rnd(0, PI * 2), stroke: ink(strokeA), lw };
      case "dot":
        return { t:"dot", depth:z.depth, x, y,
          r: rnd(4, 9), fill: ink(rnd(.08, .13)) };
    }
  });
}

// Generated once — new layout on every page load
const SCENE = generateScene();

// ── Component ────────────────────────────────────────────────────────────────

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let w, h, raf, time = 0;
    const mouse  = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };

    function resize() {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function onMouseMove(e) {
      mouse.x = (e.clientX - w / 2) / w;
      mouse.y = (e.clientY - h / 2) / h;
    }

    function drawItem(item, ox, oy) {
      const cx = item.x * w + ox;
      const cy = item.y * h + oy;
      switch (item.t) {
        case "pill":
          drawConcentricPills(ctx, cx, cy, item.w, item.h, item.rings, item.gap, item.rot, item.stroke, item.lw);
          break;
        case "arcs":
          drawConcentricArcs(ctx, cx, cy, item.r, item.rings, item.gap, item.startA, item.endA, item.stroke, item.lw);
          break;
        case "circles":
          drawConcentricCircles(ctx, cx, cy, item.r, item.rings, item.gap, item.stroke, item.lw);
          break;
        case "filled":
          drawFilledArc(ctx, cx, cy, item.r, item.startA, item.endA, item.rot, item.fill);
          break;
        case "scurves":
          drawSCurves(ctx, cx, cy, item.r, item.rings, item.gap, item.rot, item.stroke, item.lw);
          break;
        case "dot":
          drawDot(ctx, cx, cy, item.r, item.fill);
          break;
      }
    }

    function draw() {
      time += 0.0007;
      smooth.x = lerp(smooth.x, mouse.x + Math.sin(time)       * .018, 0.05);
      smooth.y = lerp(smooth.y, mouse.y + Math.cos(time * .73)  * .014, 0.05);

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#f8f6f1";
      ctx.fillRect(0, 0, w, h);

      SCENE.forEach((item) => {
        drawItem(item, smooth.x * item.depth * w, smooth.y * item.depth * h);
      });

      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="animated-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="bg-canvas" />
      <div className="grain" />
    </div>
  );
}
