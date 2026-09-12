/**
 * Dynamic CSEA Sticker Pool & Particle Simulation
 * Manages the 19 dynamic stickers from /public/csea_stickers with physical
 * falling motion, sinusoidal sway, angular momentum, and dynamic texture recycling.
 */

export const STICKER_ASSETS = [
  { id: "lightning_bolt", src: "/csea_stickers/lightning_bolt.png", name: "Lightning Bolt" },
  { id: "csea_pixel_badge", src: "/csea_stickers/csea_pixel_badge.png", name: "Pixel Badge" },
  { id: "csea_cube", src: "/csea_stickers/csea_cube.png", name: "Isometric CSEA Cube" },
  { id: "smiley_circle", src: "/csea_stickers/smiley_circle.png", name: "Smiley" },
  { id: "spark_diamond", src: "/csea_stickers/spark_diamond.png", name: "Spark Diamond" },
  { id: "atom_orbit", src: "/csea_stickers/atom_orbit.png", name: "Atom Orbit" },
  { id: "torus", src: "/csea_stickers/torus.png", name: "Chunky Torus" },
  { id: "ideas_into_impact", src: "/csea_stickers/ideas_into_impact.png", name: "Ideas Into Impact" },
  { id: "csea_oval_logo", src: "/csea_stickers/csea_oval_logo.png", name: "CSEA Oval" },
  { id: "retro_monitor", src: "/csea_stickers/retro_monitor.png", name: "Retro CRT Monitor" },
  { id: "tetrahedron", src: "/csea_stickers/tetrahedron.png", name: "Wireframe Tetrahedron" },
  { id: "build_learn_create", src: "/csea_stickers/build_learn_create.png", name: "Build Learn Create" },
  { id: "csea_pixel_logo", src: "/csea_stickers/csea_pixel_logo.png", name: "Pixel Logo" },
  { id: "david_statue", src: "/csea_stickers/david_statue.png", name: "David Sculpture" },
  { id: "glitch_text_card", src: "/csea_stickers/glitch_text_card.png", name: "Glitch Card" },
  { id: "csea_script", src: "/csea_stickers/csea_script.png", name: "CSEA Script" },
  { id: "asterisk_people_tech", src: "/csea_stickers/asterisk_people_tech.png", name: "Asterisk People" },
  { id: "ideas_globe", src: "/csea_stickers/ideas_people_opportunities_globe.png", name: "Ideas Globe" },
  { id: "venn_circles", src: "/csea_stickers/venn_circles.png", name: "Venn Circles" },
];

/**
 * Creates a single randomized sticker particle state.
 */
export function createStickerParticle(index, width, height, initial = false) {
  const margin = Math.min(100, width * 0.12);
  const spreadX = Math.max(200, width - margin * 2);
  
  // Distribute horizontally across viewport
  const baseX = (Math.random() - 0.5) * spreadX;
  
  // If initial, scatter throughout the full viewport height; otherwise spawn above top edge
  const y = initial
    ? (Math.random() - 0.5) * height * 1.2
    : height / 2 + 100 + Math.random() * 250;

  // Staggered textures across the 19 assets
  const textureIndex = Math.floor(Math.random() * STICKER_ASSETS.length);

  return {
    id: `sticker-${index}-${Date.now()}`,
    baseX,
    x: baseX,
    y,
    // Falling speed: 45 - 95 pixels per second for graceful editorial drift
    vy: 50 + Math.random() * 55,
    // Sinusoidal horizontal sway parameters
    wobbleSpeed: 0.8 + Math.random() * 1.5,
    wobbleAmp: 25 + Math.random() * 35,
    wobbleOffset: Math.random() * Math.PI * 2,
    // Gentle rotation
    rotation: (Math.random() - 0.5) * Math.PI * 0.8,
    rotationSpeed: (Math.random() - 0.5) * 0.45,
    // Scale variation (0.65x to 1.15x) for physical editorial depth
    baseScale: 0.7 + Math.random() * 0.4,
    scale: 0.7 + Math.random() * 0.4,
    textureIndex,
    // Active visibility flag
    active: true,
  };
}

/**
 * Recycles an existing particle to the top with a new dynamic texture
 */
export function recycleParticle(particle, width, height) {
  const margin = Math.min(100, width * 0.12);
  const spreadX = Math.max(200, width - margin * 2);

  particle.baseX = (Math.random() - 0.5) * spreadX;
  particle.x = particle.baseX;
  particle.y = height / 2 + 80 + Math.random() * 200;
  particle.vy = 50 + Math.random() * 55;
  particle.wobbleSpeed = 0.8 + Math.random() * 1.5;
  particle.wobbleAmp = 25 + Math.random() * 35;
  particle.wobbleOffset = Math.random() * Math.PI * 2;
  particle.rotationSpeed = (Math.random() - 0.5) * 0.45;
  particle.baseScale = 0.7 + Math.random() * 0.4;
  particle.scale = particle.baseScale;
  
  // Pick a new random dynamic texture from the 19 assets
  particle.textureIndex = Math.floor(Math.random() * STICKER_ASSETS.length);
}
