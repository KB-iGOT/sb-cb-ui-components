export const BATCH_RANGES = [
  { label: "1960-1990", start: 1960, end: 1990 },
  { label: "1991-2020", start: 1991, end: 2020 },
  { label: "2021-2025", start: 2021, end: 2025 },
];

export const CHECKBOX_OPTIONS = [
  { label: "Select All", value: "selectAll" },
  // { label: "Cadre Controlling Authority", value: "isCCA" },
];

// Criteria key used when a L0 MDO (ministry / state) selects every organisation of its hierarchy.
// The whole ministry / state is then stored as a single criteria instead of the expanded org list.
export const MINISTRY_OR_STATE_CRITERIA_KEY = "ministryOrStateId";
