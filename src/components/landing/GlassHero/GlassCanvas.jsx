import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STICKER_ASSETS, createStickerParticle, recycleParticle } from "./stickerPool";
import { glassVertexShader, glassFragmentShader } from "./glassShader";

/**
 * GlassCanvas Component (Full-Screen Edition)
 * WebGL layer executing FBO dual-pass rendering for the full viewport:
 * Pass 1: Background + Falling CSEA Stickers rendered to an offscreen WebGLRenderTarget.
 * Pass 2: Full-screen Glass Refraction Shader with optical curvature, chromatic dispersion,
 *         pointer inertia, and perimeter rim lighting.
 */
export function GlassCanvas({ pointerRef }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    // Cap DPR at 1.5 to dramatically reduce GPU fill rate while retaining Retina clarity
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // 1. THREE.WebGLRenderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      stencil: false,
      depth: false,
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.setClearColor(0xfafafc, 1.0);

    // 2. FBO Render Target for Pass 1
    const fbo = new THREE.WebGLRenderTarget(width * dpr, height * dpr, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
    });

    // 3. Background Scene & Camera (Pass 1)
    const bgScene = new THREE.Scene();
    bgScene.background = new THREE.Color(0xfafafc);

    const bgCamera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      0.1,
      1000
    );
    bgCamera.position.z = 100;

    // 4. Preload Texture Pool for the 19 Dynamic CSEA Stickers
    const textureLoader = new THREE.TextureLoader();
    const textures = STICKER_ASSETS.map((asset) => {
      const tex = textureLoader.load(asset.src);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      return tex;
    });

    // 5. Falling Stickers Particle Setup (5-6 active particles)
    const PARTICLE_COUNT = width < 768 ? 4 : 6;
    const particles = [];
    const meshes = [];

    const baseStickerSize = width < 768 ? 95 : 125;
    const stickerGeom = new THREE.PlaneGeometry(1, 1);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = createStickerParticle(i, width, height, true);
      particles.push(p);

      const mat = new THREE.MeshBasicMaterial({
        map: textures[p.textureIndex],
        transparent: true,
        opacity: 0.96,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(stickerGeom, mat);
      const s = baseStickerSize * p.scale;
      mesh.scale.set(s, s, 1);
      mesh.position.set(p.x, p.y, 0);
      mesh.rotation.z = p.rotation;

      bgScene.add(mesh);
      meshes.push(mesh);
    }

    // 6. Full-Screen Glass Refraction Scene (Pass 2)
    const glassScene = new THREE.Scene();
    const glassCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const glassUniforms = {
      uSceneTexture: { value: fbo.texture },
      uResolution: { value: new THREE.Vector2(width, height) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPointerVelocity: { value: 0.0 },
      uTime: { value: 0.0 },
      uGlassStrength: { value: 0.04 },
      uDispersion: { value: 0.012 },
      uFresnel: { value: 0.35 },
      uReducedMotion: { value: prefersReducedMotion ? 1.0 : 0.0 },
    };

    const glassMaterial = new THREE.ShaderMaterial({
      vertexShader: glassVertexShader,
      fragmentShader: glassFragmentShader,
      uniforms: glassUniforms,
      depthTest: false,
      depthWrite: false,
    });

    const quadMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), glassMaterial);
    glassScene.add(quadMesh);

    // 7. Interaction & Inertial Pointer Smoothing
    const smoothedPointer = new THREE.Vector2(0.5, 0.5);
    let smoothedVelocity = 0;

    // 8. Animation & Render Loop with Visibility Culling
    let isVisible = true;
    let animationFrameId = null;
    let lastTime = performance.now();

    const animate = (now) => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsedTime = now * 0.001;

      // Smooth pointer state with inertia
      if (pointerRef && pointerRef.current) {
        const target = pointerRef.current;
        smoothedPointer.x += (target.x - smoothedPointer.x) * 0.085;
        smoothedPointer.y += (target.y - smoothedPointer.y) * 0.085;
        smoothedVelocity += (target.velocity - smoothedVelocity) * 0.1;
      }

      glassUniforms.uPointer.value.copy(smoothedPointer);
      glassUniforms.uPointerVelocity.value = smoothedVelocity;
      glassUniforms.uTime.value = elapsedTime;

      // Update falling sticker particles
      if (!prefersReducedMotion) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const p = particles[i];
          const mesh = meshes[i];

          // Downward motion
          p.y -= p.vy * delta;

          // Sinusoidal sway
          p.x =
            p.baseX +
            Math.sin(elapsedTime * p.wobbleSpeed + p.wobbleOffset) *
              p.wobbleAmp;

          // Angular rotation
          p.rotation += p.rotationSpeed * delta;

          // Boundary check & recycle when leaving bottom
          if (p.y < -height / 2 - 140) {
            recycleParticle(p, width, height);
            mesh.material.map = textures[p.textureIndex];
            mesh.material.needsUpdate = true;
          }

          // Apply to Three.js mesh
          const currentSize = baseStickerSize * p.scale;
          mesh.scale.set(currentSize, currentSize, 1);
          mesh.position.set(p.x, p.y, 0);
          mesh.rotation.z = p.rotation;
        }
      }

      // PASS 1: Render Background + Stickers into FBO RenderTarget
      renderer.setRenderTarget(fbo);
      renderer.clear();
      renderer.render(bgScene, bgCamera);

      // PASS 2: Render Glass Shader Screen Quad to Canvas
      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(glassScene, glassCamera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Pause WebGL rendering entirely when offscreen to preserve 60/120fps scrolling
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        if (visible !== isVisible) {
          isVisible = visible;
          if (isVisible && !animationFrameId) {
            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(animate);
          }
        }
      },
      { threshold: 0.01 }
    );
    visibilityObserver.observe(container);

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;

      renderer.setSize(width, height);
      fbo.setSize(width * dpr, height * dpr);

      bgCamera.left = -width / 2;
      bgCamera.right = width / 2;
      bgCamera.top = height / 2;
      bgCamera.bottom = -height / 2;
      bgCamera.updateProjectionMatrix();

      glassUniforms.uResolution.value.set(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 10. Clean Cleanup & Disposal
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();

      stickerGeom.dispose();
      meshes.forEach((mesh) => {
        mesh.material.dispose();
      });
      textures.forEach((tex) => tex.dispose());
      fbo.dispose();
      quadMesh.geometry.dispose();
      glassMaterial.dispose();
      renderer.dispose();
    };
  }, [pointerRef]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden"
      style={{ zIndex: -2 }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
      />
    </div>
  );
}
export default GlassCanvas;
