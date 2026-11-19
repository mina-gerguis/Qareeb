import { CATEGORIES_STRUCTURE } from "@/data/places";
import { AVAILABLE_INTERESTS_MAP } from "./constants";
import { PlaceProposal, ProposalFilterTab } from "./types";

export const getInterestObj = (intKey: string) => {
  if (AVAILABLE_INTERESTS_MAP[intKey]) return AVAILABLE_INTERESTS_MAP[intKey];
  const found = Object.values(AVAILABLE_INTERESTS_MAP).find(
    (item) => item.label === intKey
  );
  if (found) return found;
  return { label: intKey, icon: "bx bx-star" };
};

export const CATEGORY_ICONS: Record<string, string> = {
  all: "bx-grid-alt",
};

CATEGORIES_STRUCTURE.forEach((main) => {
  CATEGORY_ICONS[main.name] = main.icon;
  main.subCategories.forEach((sub) => {
    CATEGORY_ICONS[sub.name] = sub.icon;
  });
});

export function getCategoryColor(cat: string): string {
  const mainCat = CATEGORIES_STRUCTURE.find(
    (m) => m.name === cat || m.subCategories.some((s) => s.name === cat)
  );
  return mainCat?.color ?? "var(--color-primary, #3b82f6)";
}

export const CATEGORY_MAP: Record<string, string> = {};
CATEGORIES_STRUCTURE.forEach((main) => {
  CATEGORY_MAP[main.name] = main.label;
  main.subCategories.forEach((sub) => {
    CATEGORY_MAP[sub.name] = sub.label;
  });
});

export const filterProposals = (
  proposals: PlaceProposal[],
  statusTab: ProposalFilterTab,
  selectedCategory: string,
  searchQuery: string
): PlaceProposal[] => {
  let list = proposals;

  // Filter by Status
  if (statusTab !== "all") {
    list = list.filter((p) => p.status === statusTab);
  }

  // Filter by Category
  if (selectedCategory !== "all") {
    list = list.filter(
      (p) =>
        p.category === selectedCategory ||
        (p.sub_categories && p.sub_categories.includes(selectedCategory))
    );
  }

  // Filter by Search Query
  if (!searchQuery.trim()) return list;

  const term = searchQuery.toLowerCase().trim();
  return list.filter((p) => {
    const name = (p.name || "").toLowerCase();
    const city = (p.city || "").toLowerCase();
    const gov = (p.governorate || "").toLowerCase();
    const cat = (p.category_label || p.category || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();
    const address = (p.address || "").toLowerCase();
    const phone = (p.phone || "").toLowerCase();
    const proposerName = (p.user_profile?.full_name || "").toLowerCase();
    const proposerUsername = (p.user_profile?.username || "").toLowerCase();

    return (
      name.includes(term) ||
      city.includes(term) ||
      gov.includes(term) ||
      cat.includes(term) ||
      desc.includes(term) ||
      address.includes(term) ||
      phone.includes(term) ||
      proposerName.includes(term) ||
      proposerUsername.includes(term)
    );
  });
};

export const getStatusCounts = (
  proposals: PlaceProposal[]
): Record<ProposalFilterTab, number> => {
  const counts: Record<ProposalFilterTab, number> = {
    all: proposals.length,
    pending: 0,
    approved: 0,
    rejected: 0,
    retracted: 0,
  };

  proposals.forEach((p) => {
    if (counts[p.status] !== undefined) {
      counts[p.status]++;
    }
  });

  return counts;
};

export const getCategoryCounts = (
  proposals: PlaceProposal[]
): Record<string, number> => {
  const counts: Record<string, number> = { all: proposals.length };

  proposals.forEach((p) => {
    if (p.category) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
  });

  return counts;
};
