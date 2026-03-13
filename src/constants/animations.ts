export const ANIMATION = {
  SPRING_CONFIG: {
    damping: 12,
    stiffness: 150,
    mass: 0.5,
  },
  DURATIONS: {
    fast: 150,
    normal: 300,
    slow: 500,
    celebration: 1500,
  },
  EASING: {
    bounce: { damping: 8, stiffness: 200 },
    gentle: { damping: 15, stiffness: 100 },
  },
} as const;
