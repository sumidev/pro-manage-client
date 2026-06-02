import { resolveStorageUrl } from "@/config/appConfig";

export const getMemberFirstName = (m) => m?.first_name || m?.firstName || "";
export const getMemberLastName = (m) => m?.last_name || m?.lastName || "";

export const getMemberFullName = (m) =>
  `${getMemberFirstName(m)} ${getMemberLastName(m)}`.trim() || m?.email || "Member";

export const getMemberInitials = (m) => {
  const f = getMemberFirstName(m).charAt(0);
  const l = getMemberLastName(m).charAt(0);
  return `${f}${l}`.toUpperCase() || "?";
};

export const getMemberAvatarUrl = (m) => {
  const pic = m?.profile_pic;
  if (!pic) return null;
  return resolveStorageUrl(pic);
};

/** Shape for UserSearchDropdown and assignee pickers */
export const normalizeMemberForDropdown = (m) => ({
  id: m.id,
  firstName: getMemberFirstName(m),
  lastName: getMemberLastName(m),
  email: m.email || "",
  role: m.role,
  avatar: getMemberAvatarUrl(m),
});

export const normalizeMembersForDropdown = (members = []) =>
  (members || []).map(normalizeMemberForDropdown);
