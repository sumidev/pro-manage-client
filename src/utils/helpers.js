import { AVATAR_COLORS } from "../constants/otherConstants";

export const getUserColor = (id) => {
  if (id === "unassigned") return "bg-indigo-500/100 text-indigo-500 border border-indigo-300";
  if (typeof id === "number") {
    return AVATAR_COLORS[id % AVATAR_COLORS.length];
  }

  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};
