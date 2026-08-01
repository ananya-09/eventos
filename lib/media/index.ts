// Premium Visual Overlay Constants
export const SHARED_OVERLAYS = {
  heroOverlay: "absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/10 opacity-85 z-10",
  cardOverlay: "absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-10 opacity-95",
  eventOverlay: "absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-slate-950/10 z-10",
};

// 1. Expanded Curated Banners Pool (24 highly premium entries across 6 distinct categories)
export const BANNER_CATEGORIES = {
  AI: [
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200", // Abstract glowing node mesh
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200", // Sleek deep cyber networks
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200", // Fluid pastel digital mesh
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200", // Minimal purple mesh gradient
  ],
  WEB_DEV: [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200", // Sleek dark code editor monitor
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200", // Close up laptop workspace coding
    "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1200", // Dark soft code terminal
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200", // Abstract coding language overlay
  ],
  CYBERSECURITY: [
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200", // Emerald tech cyber grid lines
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200", // Dark green neon digital matrix
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200", // Emerald dashboard console telemetry
    "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=1200", // Minimalist dark cyber hub neon glow
  ],
  DESIGN: [
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200", // Modern paint abstract shapes
    "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200", // High-end orange mesh system textures
    "https://images.unsplash.com/photo-1618005198143-e528346d9a99?q=80&w=1200", // Soft fluid editorial gradients
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200", // Creative warm abstract gradient
  ],
  STARTUPS: [
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200", // Sleek SaaS dashboard mockup
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200", // Elegant minimal workspace tech
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200", // Premium business project suite
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200", // Technical finance charts
  ],
  EVENTS: [
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200", // Dev collaboration tables
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200", // Summit conference main stage
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200", // Tech panel Q&A setup
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200", // Coding community workshop group
  ],
};

export const CURATED_EVENT_COVERS = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800", // Summit conference main stage
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800", // Tech panel Q&A setup
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800", // Coding community workshop group
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800", // Cyber matrix grid
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800", // Dark code monitor terminal
  "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800", // Premium developer workstation keyboard
];

/**
 * Deterministic Category-Based Visual Mapping to ensure distinct memory,
 * ecosystem differentiation, and collision avoidance.
 */
export function getCuratedCommunityBanner(slug: string): string {
  const normSlug = slug.toLowerCase();

  // 1. AI / ML / Intelligence keywords
  if (
    normSlug.includes("ai") || 
    normSlug.includes("ml") || 
    normSlug.includes("intel") || 
    normSlug.includes("neural") || 
    normSlug.includes("learn")
  ) {
    const idx = Math.abs(hashCode(slug)) % BANNER_CATEGORIES.AI.length;
    return BANNER_CATEGORIES.AI[idx];
  }

  // 2. Cyber / Security keywords
  if (
    normSlug.includes("cyber") || 
    normSlug.includes("security") || 
    normSlug.includes("sec") || 
    normSlug.includes("hack") || 
    normSlug.includes("defense")
  ) {
    const idx = Math.abs(hashCode(slug)) % BANNER_CATEGORIES.CYBERSECURITY.length;
    return BANNER_CATEGORIES.CYBERSECURITY[idx];
  }

  // 3. Design / UI / UX / Product keywords
  if (
    normSlug.includes("design") || 
    normSlug.includes("ux") || 
    normSlug.includes("ui") || 
    normSlug.includes("creative") || 
    normSlug.includes("art")
  ) {
    const idx = Math.abs(hashCode(slug)) % BANNER_CATEGORIES.DESIGN.length;
    return BANNER_CATEGORIES.DESIGN[idx];
  }

  // 4. Startups / Business / Founders
  if (
    normSlug.includes("startup") || 
    normSlug.includes("saas") || 
    normSlug.includes("founder") || 
    normSlug.includes("biz") || 
    normSlug.includes("business")
  ) {
    const idx = Math.abs(hashCode(slug)) % BANNER_CATEGORIES.STARTUPS.length;
    return BANNER_CATEGORIES.STARTUPS[idx];
  }

  // 5. Software / Web Dev / Code / Frontend / Backend
  if (
    normSlug.includes("web") || 
    normSlug.includes("dev") || 
    normSlug.includes("code") || 
    normSlug.includes("soft") || 
    normSlug.includes("front") || 
    normSlug.includes("back") ||
    normSlug.includes("javascript") ||
    normSlug.includes("python") ||
    normSlug.includes("rust")
  ) {
    const idx = Math.abs(hashCode(slug)) % BANNER_CATEGORIES.WEB_DEV.length;
    return BANNER_CATEGORIES.WEB_DEV[idx];
  }

  // Fallback: Deterministic category-staggered hashing using slug code
  const categories = Object.values(BANNER_CATEGORIES);
  const catIdx = Math.abs(hashCode(slug)) % categories.length;
  const targetCategory = categories[catIdx];
  const itemIdx = Math.abs(hashCode(slug + "fallback")) % targetCategory.length;
  return targetCategory[itemIdx];
}

export function getCuratedEventCover(id: string): string {
  const hash = Math.abs(hashCode(id));
  const index = hash % CURATED_EVENT_COVERS.length;
  return CURATED_EVENT_COVERS[index];
}

// Simple deterministic hash helper
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
