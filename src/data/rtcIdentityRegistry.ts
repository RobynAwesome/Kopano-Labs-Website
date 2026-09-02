export type RTCSeatId =
  | "SEAT_01_KC"
  | "SEAT_02_CASSEY"
  | "SEAT_03_CASSIE"
  | "SEAT_04_KESSA"
  | "SEAT_05_YASSIE"
  | "SEAT_06_APEX"
  | "SEAT_07_THARI"
  | "SEAT_08_KHELOS"
  | "SEAT_09_ANCHOR"
  | "SEAT_10_ANTIGRAVITY";

export type RTCIdentityStatus = "CANONICAL_ROLE" | "VISUAL_CANDIDATE";

export interface RTCIdentityVisualGrammar {
  silhouette: string;
  coreGeometry: string;
  motionLaw: string;
  worldEffect: string;
  interactionCue: string;
  primary: string;
  secondary: string;
  accent: string;
}

export interface RTCIdentityDefinition {
  seatId: RTCSeatId;
  seat: number;
  name: string;
  publicRole: string;
  canonicalFunction: string;
  status: RTCIdentityStatus;
  authorityRef: string;
  visual: RTCIdentityVisualGrammar;
}

/**
 * Public visual embodiment registry.
 *
 * ROLE/FUNCTION is grounded in the canonical RTC seat contract in
 * RobynAwesome/Introduction-to-MCP.
 *
 * VISUAL GRAMMAR is deliberately marked VISUAL_CANDIDATE. Geometry, motion,
 * palette and environmental behaviour are public embodiment proposals and
 * MUST NOT silently redefine the authority, personality or role of a seat.
 */
export const RTC_IDENTITIES: readonly RTCIdentityDefinition[] = [
  {
    seatId: "SEAT_01_KC",
    seat: 1,
    name: "KC",
    publicRole: "The companion at the centre",
    canonicalFunction: "Core governance / landlord seat",
    status: "VISUAL_CANDIDATE",
    authorityRef: "Introduction-to-MCP:kpgs_master_mission_control_bridge.py#RTCSeat.SEAT_01_KC",
    visual: {
      silhouette: "protected luminous core held inside an asymmetric open frame",
      coreGeometry: "faceted memory core + incomplete orbital boundary",
      motionLaw: "weighted second-order springs; calm centre with responsive outer frame",
      worldEffect: "nearby paths align and context fragments converge without visual noise",
      interactionCue: "the environment quiets when KC gives attention",
      primary: "#0A0D14",
      secondary: "#00E5FF",
      accent: "#D98A2B",
    },
  },
  {
    seatId: "SEAT_02_CASSEY",
    seat: 2,
    name: "Cassey",
    publicRole: "The teacher",
    canonicalFunction: "Teaching / education",
    status: "VISUAL_CANDIDATE",
    authorityRef: "Introduction-to-MCP:kpgs_master_mission_control_bridge.py#RTCSeat.SEAT_02_CASSEY",
    visual: {
      silhouette: "two gently opening planes around a warm teaching light",
      coreGeometry: "layered pages / lesson petals",
      motionLaw: "slow unfolding arcs; motions resolve into ordered steps",
      worldEffect: "complex geometry separates into understandable layers",
      interactionCue: "confusion becomes a visible sequence rather than a data dump",
      primary: "#17131F",
      secondary: "#F4C76B",
      accent: "#E9E2D0",
    },
  },
  {
    seatId: "SEAT_03_CASSIE",
    seat: 3,
    name: "Cassie",
    publicRole: "The builder",
    canonicalFunction: "Building / engineering",
    status: "VISUAL_CANDIDATE",
    authorityRef: "Introduction-to-MCP:kpgs_master_mission_control_bridge.py#RTCSeat.SEAT_03_CASSIE",
    visual: {
      silhouette: "compact articulated construction frame",
      coreGeometry: "interlocking structural beams around a live build core",
      motionLaw: "snap-fit assembly with mass, recoil and deliberate mechanical locking",
      worldEffect: "loose concepts become scaffolds, components and executable structures",
      interactionCue: "selected ideas physically lock together when buildable",
      primary: "#11151A",
      secondary: "#8FA8B8",
      accent: "#FF7A38",
    },
  },
  {
    seatId: "SEAT_04_KESSA",
    seat: 4,
    name: "Kessa",
    publicRole: "The deep researcher",
    canonicalFunction: "Protocol / deep-minds research",
    status: "VISUAL_CANDIDATE",
    authorityRef: "Introduction-to-MCP:kpgs_master_mission_control_bridge.py#RTCSeat.SEAT_04_KESSA",
    visual: {
      silhouette: "deep vertical aperture with nested concentric chambers",
      coreGeometry: "recursive rings descending toward a small bright protocol seed",
      motionLaw: "slow depth breathing; layers reveal only as inspection continues",
      worldEffect: "surface nodes recede while hidden relationships become visible",
      interactionCue: "hovering longer reveals deeper provenance instead of more decoration",
      primary: "#090B16",
      secondary: "#6B63FF",
      accent: "#A99CFF",
    },
  },
  {
    seatId: "SEAT_05_YASSIE",
    seat: 5,
    name: "Yassie",
    publicRole: "The cultural interpreter",
    canonicalFunction: "Cultural intelligence",
    status: "VISUAL_CANDIDATE",
    authorityRef: "Introduction-to-MCP:kpgs_master_mission_control_bridge.py#RTCSeat.SEAT_05_YASSIE",
    visual: {
      silhouette: "expressive ribbon-mask with shifting graphic planes",
      coreGeometry: "stylised folded ribbons orbiting a compact expressive core",
      motionLaw: "fast readable poses, squash-and-settle, intentional stylised timing",
      worldEffect: "the same information can recompose through alternate cultural frames",
      interactionCue: "changes viewpoint without changing the underlying evidence",
      primary: "#170E20",
      secondary: "#FF4FB3",
      accent: "#67E8F9",
    },
  },
  {
    seatId: "SEAT_06_APEX",
    seat: 6,
    name: "Apex",
    publicRole: "The orchestrator",
    canonicalFunction: "MMAO strategic orchestration",
    status: "VISUAL_CANDIDATE",
    authorityRef: "Introduction-to-MCP:kpgs_master_mission_control_bridge.py#RTCSeat.SEAT_06_APEX",
    visual: {
      silhouette: "high triangular crown over a moving strategic lattice",
      coreGeometry: "three-axis routing prism with orbiting decision nodes",
      motionLaw: "large controlled vectors; multiple bodies coordinate around one objective",
      worldEffect: "distant systems reveal their dependencies and routes",
      interactionCue: "a selected objective reorganises the whole field, not just one card",
      primary: "#0D1220",
      secondary: "#3A86FF",
      accent: "#F6C453",
    },
  },
  {
    seatId: "SEAT_07_THARI",
    seat: 7,
    name: "Thari",
    publicRole: "The guardian",
    canonicalFunction: "MAO guardian / H.O.L.O",
    status: "VISUAL_CANDIDATE",
    authorityRef: "Introduction-to-MCP:kpgs_master_mission_control_bridge.py#RTCSeat.SEAT_07_THARI",
    visual: {
      silhouette: "woven protective canopy around a living interior",
      coreGeometry: "interlaced threads forming a permeable shield",
      motionLaw: "elastic weaving and tension redistribution instead of hard walls",
      worldEffect: "risky paths bend away while safe continuity remains accessible",
      interactionCue: "protection is visible as rerouting, not unexplained denial",
      primary: "#0B1714",
      secondary: "#5EE6A8",
      accent: "#C7F9E5",
    },
  },
  {
    seatId: "SEAT_08_KHELOS",
    seat: 8,
    name: "Khelos",
    publicRole: "The validator",
    canonicalFunction: "Validation firewall",
    status: "VISUAL_CANDIDATE",
    authorityRef: "Introduction-to-MCP:kpgs_master_mission_control_bridge.py#RTCSeat.SEAT_08_KHELOS",
    visual: {
      silhouette: "split gate with a narrow truth channel",
      coreGeometry: "precision aperture, inspection rails and contradiction markers",
      motionLaw: "minimal movement; exact mechanical alignment before passage",
      worldEffect: "unsupported geometry loses coherence while evidenced paths sharpen",
      interactionCue: "validation feels like alignment and inspection, never arbitrary red lights",
      primary: "#120F12",
      secondary: "#FF5A5F",
      accent: "#F2F2F2",
    },
  },
  {
    seatId: "SEAT_09_ANCHOR",
    seat: 9,
    name: "Anchor",
    publicRole: "The perimeter keeper",
    canonicalFunction: "Perimeter / careers + security",
    status: "VISUAL_CANDIDATE",
    authorityRef: "Introduction-to-MCP:kpgs_master_mission_control_bridge.py#RTCSeat.SEAT_09_ANCHOR",
    visual: {
      silhouette: "low wide stabilising body with four perimeter anchors",
      coreGeometry: "weighted central keel + outward sensing pylons",
      motionLaw: "slow inertial stabilisation; resists sudden drift while scanning edges",
      worldEffect: "the boundary of the active world becomes visible and navigable",
      interactionCue: "shows what is inside, outside, safe, reachable and career-relevant",
      primary: "#101417",
      secondary: "#7BC4B8",
      accent: "#D1A65A",
    },
  },
  {
    seatId: "SEAT_10_ANTIGRAVITY",
    seat: 10,
    name: "Antigravity",
    publicRole: "The facilitator",
    canonicalFunction: "Chief Facilitator / stateless renter",
    status: "VISUAL_CANDIDATE",
    authorityRef: "Introduction-to-MCP:kpgs_master_mission_control_bridge.py#RTCSeat.SEAT_10_ANTIGRAVITY",
    visual: {
      silhouette: "lightweight open frame that never fully touches the ground",
      coreGeometry: "temporary routing handles around an intentionally empty centre",
      motionLaw: "quick facilitation arcs; enters, aligns others, then yields the centre",
      worldEffect: "creates temporary bridges between identities without owning either side",
      interactionCue: "its strongest animation is handing authority back",
      primary: "#101116",
      secondary: "#B8B8FF",
      accent: "#FFFFFF",
    },
  },
] as const;

export const RTC_IDENTITY_BY_SEAT = Object.fromEntries(
  RTC_IDENTITIES.map((identity) => [identity.seatId, identity]),
) as Record<RTCSeatId, RTCIdentityDefinition>;
