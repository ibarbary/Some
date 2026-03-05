export const ACHIEVEMENTS = {
  FIRST_STEP: {
    key: "FIRST_STEP",
    name: "First Step",
    // condition: first level ever completed (check total level count across all languages)
  },
  PERFECT_SCORE: {
    key: "PERFECT_SCORE",
    name: "Perfect Score",
    // condition: accuracy === 1.0 on any level
  },
  FAST_LEARNER: {
    key: "FAST_LEARNER",
    name: "Fast Learner",
    // condition: completes 3 levels in the same stage
  },
  STREAK_7: {
    key: "STREAK_7",
    name: "7 Day Streak",
    // condition: current_streak_days >= 7
  },
  STREAK_30: {
    key: "STREAK_30",
    name: "30 Day Streak",
    // condition: current_streak_days >= 30
  },
} as const;
