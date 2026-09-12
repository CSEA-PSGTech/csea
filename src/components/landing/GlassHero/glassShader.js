/**
 * Glass Refraction & Chromatic Dispersion Shader (Full Screen Edition)
 * Treats the entire viewport as a physical retro-futurist glass lens.
 * Implements FBO-based optical refraction, pointer inertia perturbation,
 * RGB chromatic dispersion, subtle frosted grain, and studio rim lighting.
 */

export const glassVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const glassFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uSceneTexture;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uPointerVelocity;
  uniform float uTime;
  uniform float uGlassStrength;
  uniform float uDispersion;
  uniform float uFresnel;
  uniform float uReducedMotion;

  varying vec2 vUv;

  void main() {
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);

    // Coordinate centered on the screen [ -0.5, 0.5 ]
    vec2 p = (vUv - vec2(0.5)) * aspect;
    float centerDist = length(p);

    // --- FULL-SCREEN PHYSICAL LENS CURVATURE ---
    // Gentle barrel curvature outward from the screen center
    vec2 lensCurvature = p * (centerDist * 0.04);

    // --- MOUSE INERTIAL PERTURBATION ---
    vec2 mouseDelta = (vUv - uPointer) * aspect;
    float mouseDist = length(mouseDelta);
    // Smooth Gaussian falloff around cursor
    float mouseFalloff = exp(-mouseDist * 5.2);
    vec2 mouseWarp = normalize(mouseDelta + vec2(0.0001)) * mouseFalloff * (0.028 + uPointerVelocity * 0.055);

    // Combined optical refraction vector
    vec2 totalOffset = (lensCurvature * uGlassStrength + mouseWarp) * (1.0 - uReducedMotion * 0.9);

    // --- CHROMATIC DISPERSION (RGB Channel Separation) ---
    float disp = uDispersion * (1.0 + uPointerVelocity * 0.7);
    vec2 uvR = clamp(vUv - totalOffset * (1.0 + disp), vec2(0.001), vec2(0.999));
    vec2 uvG = clamp(vUv - totalOffset, vec2(0.001), vec2(0.999));
    vec2 uvB = clamp(vUv - totalOffset * (1.0 - disp), vec2(0.001), vec2(0.999));

    // Optimized 3-tap spectral dispersion
    vec3 baseCol = texture2D(uSceneTexture, uvG).rgb;
    float colR = texture2D(uSceneTexture, uvR).r;
    float colB = texture2D(uSceneTexture, uvB).b;
    vec3 refractedColor = vec3(colR, baseCol.g, colB);

    // CSEA Crystalline tint (clean with hint of electric cobalt)
    vec3 glassTint = vec3(0.985, 0.99, 1.0);
    refractedColor = refractedColor * glassTint + vec3(0.0, 0.15, 1.0) * 0.012;

    // --- SPECULAR RIM LIGHTING & HIGHLIGHTS ---
    // 1. Soft screen border bevel / perimeter vignette
    float edgeX = min(vUv.x, 1.0 - vUv.x);
    float edgeY = min(vUv.y, 1.0 - vUv.y);
    float borderDist = min(edgeX, edgeY);
    float borderRim = smoothstep(0.03, 0.0, borderDist) * 0.4;

    // 2. Dynamic cursor gleam tracking mouse light source
    float cursorGleam = pow(max(0.0, 1.0 - mouseDist * 2.6), 3.0) * 0.32;

    // 3. Subtle directional studio sheen from top
    float topSheen = smoothstep(0.15, 0.0, 1.0 - vUv.y) * 0.12;

    vec3 highlights = vec3(1.0) * (borderRim + cursorGleam + topSheen) * uFresnel;

    vec3 finalColor = refractedColor + highlights;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
