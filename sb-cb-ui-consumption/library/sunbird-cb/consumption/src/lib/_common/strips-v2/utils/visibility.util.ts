import { ContentSectionConfig, PillConfig, TabConfig, VisibilityMode } from '../models/content-section.model'

export function filterVisibleSections(sections: ContentSectionConfig[] | undefined | null): ContentSectionConfig[] {
  return (sections ?? []).filter(section => section?.visibilityMode === VisibilityMode.Visible)
}

export function filterVisibleTabs(tabs: TabConfig[] | undefined | null): TabConfig[] {
  return (tabs ?? []).filter(tab => tab?.visibilityMode === VisibilityMode.Visible)
}

export function filterVisiblePills(pills: PillConfig[] | undefined | null): PillConfig[] {
  return (pills ?? []).filter(pill => pill?.visibilityMode === VisibilityMode.Visible)
}
