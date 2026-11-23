import { NsAccessControlConfig } from "../_models/access-control.model";

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
export const MINISTRY_OR_STATE_FILTER_KEY = "profileDetails.ministryOrStateId";

// MDO only. Every organisation picked through the "Select all" option of the Organisation condition.
// It is saved as an empty rootOrgId list, and stands in for it in the form so the condition is filled.
export const ALL_ORGANISATIONS_SELECTION = "ALL_ORGANISATIONS";

// MDO only. The most organisations that can be picked one by one in an Organisation condition.
export const MAX_ORGANISATION_SELECTIONS = 500;

export const NO_SERVICES_MAPPED_MESSAGE =
  "No services are currently mapped to your State/Ministry. Please contact the concerned authority for further assistance.";

export const ORGANISATION_SELECTION_MODES = [
  { label: "Manual Selection", value: "individual" },
  { label: "Select all", value: "all" },
];

export const SPV_MAX_SELECTIONS = 500;
export const SPV_LIMITED_SELECTION_ENTITIES: string[] = [
  NsAccessControlConfig.SelectionType.Users,
  NsAccessControlConfig.SelectionType.Organizations,
  NsAccessControlConfig.SelectionType.Designation,
];
export const SPV_DEFAULT_USER_GROUP_LIMIT = 5;
export const SPV_MIN_GROUP_LICENCES = 1;
export const SPV_CRITERIA_KEYS: { [entity: string]: string } = {
  [NsAccessControlConfig.SelectionType.Cadre]: "cadre",
};
export const SPV_DEFAULT_UNAUDITED_LICENCES_INFO = "Due to a switch of the enrolment check preference, these licence "
  + "consumptions aren't tracked against the user groups set earlier in SPV.";
export const SPV_DEFAULT_UNAUDITED_LICENCES_ZERO_INFO = "Licences consumed but not recorded against any user group: "
  + "enrolments while the preference was No, or enrolments that couldn't be recorded against a group while settings "
  + "were being saved.";
export const SPV_ENROLMENT_CHECK_OPTIONS: { value: boolean; title: string; description: string; summary: string }[] = [
  {
    value: true,
    title: "Yes",
    description: "Learners must match a user group set here before the course's own rules are checked.",
    summary: "Yes — provider-level access settings",
  },
  {
    value: false,
    title: "No",
    description: "Only each course's user groups in the Content Portal are checked. User groups can't be created here.",
    summary: "No — each course's user groups in the Content Portal",
  },
];
export const SPV_USER_GROUP_COLOURS = ["#1b4ca1", "#f59a38", "#35a08e", "#7b5ea7", "#d1495b", "#8c6d46", "#2f9fd0", "#6b7280"];

export const CRITERIA_LABELS: { [key: string]: string } = {
  [NsAccessControlConfig.SelectionType.Organizations]: "Organisation",
  [MINISTRY_OR_STATE_CRITERIA_KEY]: "Organisation",
  [NsAccessControlConfig.SelectionType.Users]: "User",
  [NsAccessControlConfig.SelectionType.Group]: "Group",
  [NsAccessControlConfig.SelectionType.Designation]: "Designation",
  [NsAccessControlConfig.SelectionType.VerificationStatus]: "Verification status",
  [NsAccessControlConfig.SelectionType.Cadre]: "Cadre",
  [NsAccessControlConfig.SelectionType.Service]: "Service",
  [NsAccessControlConfig.SelectionType.Batch]: "Batch",
  [NsAccessControlConfig.SelectionType.CentralDeputation]: "Deputation flag"
};
