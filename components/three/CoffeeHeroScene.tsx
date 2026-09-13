"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const STEAM_COUNT = 160;
const BEAN_COUNT = 46;

function buildCup() {
  const group = new THREE.Group();

  const profile = [
    [0.5, 0.0],
    [0.55, 0.02],
    [0.6, 0.9],
    [0.66, 1.05],
    [0.6, 1.1],
    [0.54, 0.95],
    [0.5, 0.05],
    [0.5, 0.0],
  ].map(([r, y]) => new THREE.Vector2(r, y));

  const cupGeometry = new THREE.LatheGeometry(profile, 64);
  const cupMaterial = new THREE.MeshStandardMaterial({
    color: 0xf2efe6,
    roughness: 0.35,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  const cup = new THREE.Mesh(cupGeometry, cupMaterial);
  group.add(cup);

  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.34, 0.075, 16, 48),
    cupMaterial
  );
  handle.rotation.y = Math.PI / 2;
  handle.position.set(0.62, 0.55, 0);
  group.add(handle);

  const coffeeSurface = new THREE.Mesh(
    new THREE.CircleGeometry(0.48, 48),
    new THREE.MeshStandardMaterial({
      color: 0x3b2418,
      roughness: 0.25,
      metalness: 0.15,
    })
  );
  coffeeSurface.rotation.x = -Math.PI / 2;
  coffeeSurface.position.y = 0.93;
  group.add(coffeeSurface);

  const saucer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 1.0, 0.06, 48),
    cupMaterial
  );
  saucer.position.y = -0.05;
  group.add(saucer);

  return group;
}

function buildSteam() {
  const positions = new Float32Array(STEAM_COUNT * 3);
  const speeds = new Float32Array(STEAM_COUNT);
  const phases = new Float32Array(STEAM_COUNT);
  const sizes = new Float32Array(STEAM_COUNT);

  for (let i = 0; i < STEAM_COUNT; i++) {
    const radius = Math.random() * 0.28;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = 0.95;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
    speeds[i] = 0.12 + Math.random() * 0.1;
    phases[i] = Math.random();
    sizes[i] = 16 + Math.random() * 22;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0xf7efe0) },
    },
    vertexShader: `
      attribute float aSpeed;
      attribute float aPhase;
      attribute float aSize;
      uniform float uTime;
      varying float vAlpha;
      void main() {
        float t = fract(uTime * aSpeed + aPhase);
        vec3 pos = position;
        pos.y += t * 2.6;
        float sway = t * t;
        pos.x += sin(t * 6.2831 + aPhase * 12.0) * 0.35 * sway;
        pos.z += cos(t * 6.2831 + aPhase * 9.0) * 0.35 * sway;
        vAlpha = sin(t * 3.14159);
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aSize * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        float circle = smoothstep(0.5, 0.1, d);
        gl_FragColor = vec4(uColor, circle * vAlpha * 0.05);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  return new THREE.Points(geometry, material);
}

function buildBeans() {
  const geometry = new THREE.CapsuleGeometry(0.1, 0.2, 4, 8);
  const material = new THREE.MeshStandardMaterial({
    color: 0x4a3324,
    roughness: 0.6,
    metalness: 0.05,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, BEAN_COUNT);

  const dummy = new THREE.Object3D();
  const depths: number[] = [];
  for (let i = 0; i < BEAN_COUNT; i++) {
    const depth = -5 + Math.random() * 10;
    depths.push(depth);
    dummy.position.set(
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 5 + 0.5,
      depth
    );
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    const s = 0.6 + Math.random() * 0.8;
    dummy.scale.set(s * 0.65, s, s * 0.5);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    mesh.setColorAt(i, new THREE.Color(0x4a3324).offsetHSL(0, 0, (Math.random() - 0.5) * 0.08));
  }

  return { mesh, depths };
}

export function CoffeeHeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x140d09, 0.055);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.9, 6.2);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    scene.background = new THREE.Color(0x140d09);

    const ambient = new THREE.AmbientLight(0xcbb49a, 1.8);
    scene.add(ambient);

    const key = new THREE.PointLight(0xffb877, 12, 20, 2);
    key.position.set(2.5, 3.5, 3);
    scene.add(key);

    const fill = new THREE.PointLight(0x839bae, 5, 20, 2);
    fill.position.set(-3, 1.5, -2);
    scene.add(fill);

    const rim = new THREE.PointLight(0xffe3b3, 6, 15, 2);
    rim.position.set(-1, 2, -3);
    scene.add(rim);

    const cup = buildCup();
    cup.position.y = -0.3;
    scene.add(cup);

    const steam = buildSteam();
    steam.position.y = -0.3;
    scene.add(steam);

    const { mesh: beans } = buildBeans();
    scene.add(beans);

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    function onPointerMove(e: PointerEvent) {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onPointerMove);

    let scrollProgress = 0;
    function onScroll() {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      scrollProgress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function onResize() {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let frameId: number;

    function animate() {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      cup.rotation.y = elapsed * 0.15 + scrollProgress * Math.PI * 1.4;
      cup.position.y = -0.3 + Math.sin(elapsed * 0.6) * 0.04;

      beans.rotation.y = elapsed * 0.02;

      camera.position.x = mouseX * 0.6;
      camera.position.y = 0.9 - mouseY * 0.3 - scrollProgress * 0.5;
      camera.position.z = 6.2 - scrollProgress * 2.2;
      camera.lookAt(0, 0.5, 0);

      (steam.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsed;

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
      cup.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
        }
      });
      beans.geometry.dispose();
      steam.geometry.dispose();
      (steam.material as THREE.Material).dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0" aria-hidden />;
}
