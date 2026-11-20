"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * مجسم ثلاثي الأبعاد (Three.js) لشبكة المترو: ثلاث خطوط متوهجة ومحطات تبادل.
 * - يتوقف تلقائياً لما يخرج من الشاشة أو لو المستخدم مفعّل تقليل الحركة.
 * - بيتحرك مع السحب بالإصبع أو الماوس.
 */
const LINES: { color: number; pts: [number, number, number][] }[] = [
  { color: 0xef4444, pts: [[-4, 0.2, -2.2], [-2, 0.2, -1.2], [0, 0.2, 0], [2, 0.2, 1.2], [4, 0.2, 2.4]] },
  { color: 0x22c55e, pts: [[-3.6, 0, 2.6], [-1.8, 0, 1.2], [0, 0, 0], [1.6, 0, -1.4], [3.8, 0, -2.8]] },
  { color: 0xf59e0b, pts: [[-4, -0.2, 0.2], [-2, -0.2, -0.4], [0, -0.2, 0], [2, -0.2, 0.5], [4, -0.2, -0.3]] },
];

export default function HomeMetro3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setSupported(false);
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 4.5, 9);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(4, 8, 6);
    scene.add(dir);

    const group = new THREE.Group();
    scene.add(group);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T): T => {
      disposables.push(o);
      return o;
    };

    // قاعدة دائرية
    const base = new THREE.Mesh(
      track(new THREE.CylinderGeometry(5.4, 5.4, 0.12, 64)),
      track(new THREE.MeshStandardMaterial({ color: 0x0b1b3a, transparent: true, opacity: 0.55, roughness: 0.6 }))
    );
    base.position.y = -0.6;
    group.add(base);
    const grid = new THREE.GridHelper(10.5, 21, 0x3b82f6, 0x1e3a8a);
    grid.position.y = -0.53;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
    track(grid.geometry);
    track(grid.material as THREE.Material);
    group.add(grid);

    // الخطوط والمحطات
    const stationGeo = track(new THREE.SphereGeometry(0.15, 20, 20));
    LINES.forEach((l) => {
      const curve = new THREE.CatmullRomCurve3(l.pts.map((p) => new THREE.Vector3(...p)));
      const tube = new THREE.Mesh(
        track(new THREE.TubeGeometry(curve, 80, 0.07, 10, false)),
        track(new THREE.MeshStandardMaterial({ color: l.color, emissive: l.color, emissiveIntensity: 0.6 }))
      );
      group.add(tube);
      const mat = track(new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: l.color, emissiveIntensity: 0.4 }));
      l.pts.forEach((p, i) => {
        if (i === 2) return;
        const s = new THREE.Mesh(stationGeo, mat);
        s.position.set(...p);
        group.add(s);
      });
    });
    // محطة التبادل
    const hub = new THREE.Mesh(
      track(new THREE.TorusGeometry(0.34, 0.07, 16, 40)),
      track(new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x60a5fa, emissiveIntensity: 0.7 }))
    );
    hub.rotation.x = Math.PI / 2;
    group.add(hub);

    const resize = () => {
      const w = el.clientWidth || 300;
      const h = el.clientHeight || 300;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.position.z = w < 500 ? 12 : 9;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(el);

    // سحب للتدوير
    let dragging = false;
    let lastX = 0;
    let vel = 0;
    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      vel = (e.clientX - lastX) * 0.01;
      group.rotation.y += vel;
      lastX = e.clientX;
    };
    const up = () => {
      dragging = false;
    };
    renderer.domElement.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      if (!reduce && !dragging) group.rotation.y += 0.004 + vel * 0.5;
      vel *= 0.95;
      hub.scale.setScalar(1 + Math.sin(performance.now() / 600) * 0.06);
      renderer.render(scene, camera);
    };
    if (reduce) {
      group.rotation.y = 0.6;
      renderer.render(scene, camera);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  if (!supported) return null;

  return (
    <section
      dir="rtl"
      style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 20px 40px" }}
      aria-label="شبكة المترو ثلاثية الأبعاد"
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "24px",
          background: "var(--bg-glass-card)",
          border: "1px solid var(--border-glass)",
          borderRadius: "24px",
          padding: "24px",
          overflow: "hidden",
        }}
      >
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <h2 style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 800, color: "var(--color-fg)", margin: "0 0 10px" }}>
            شبكة المترو في إيدك
          </h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, margin: "0 0 16px" }}>
            لف المجسم بإصبعك وشوف الخطوط ومحطات التبادل. ولو عايز تحسب رحلتك وسعر التذكرة، افتح خريطة المترو.
          </p>
          <a
            href="/metro"
            style={{
              display: "inline-block",
              padding: "10px 22px",
              borderRadius: "12px",
              background: "var(--color-primary)",
              color: "#fff",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            افتح خريطة المترو
          </a>
        </div>
        <div ref={wrapRef} style={{ flex: "1 1 320px", height: "min(60vw, 340px)", minHeight: "240px", cursor: "grab" }} />
      </div>
    </section>
  );
}
