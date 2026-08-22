import registry from '../../data/section-registry.json';

export interface SectionEntry {
  number: number;
  title: string;
  slug: string;
  group: string;
  published: boolean;
  /**
   * Permanent URL when an approved release specifies one that does not follow the
   * group-derived pattern. Section 0's approved slug is `/before-you-launch/`, top-level,
   * while its navigation group remains Foundation.
   */
  route?: string;
}

export interface SectionGroup {
  id: string;
  label: string;
  urlSegment: string;
  sections: number[];
}

export const sections: SectionEntry[] = registry.sections;
export const groups: SectionGroup[] = registry.groups;
export const referencePages = registry.referencePages;

export function groupOf(section: SectionEntry): SectionGroup {
  const group = groups.find((g) => g.id === section.group);
  if (!group) throw new Error(`Section ${section.number} references unknown group ${section.group}`);
  return group;
}

/**
 * Canonical, permanent URL for a section. Stable whether or not it is published yet.
 * An approved release may override the group-derived path via `route`.
 */
export function sectionUrl(section: SectionEntry): string {
  return section.route ?? `/${groupOf(section).urlSegment}/${section.slug}/`;
}

export function sectionByNumber(number: number): SectionEntry | undefined {
  return sections.find((s) => s.number === number);
}

export function sectionBySlug(slug: string): SectionEntry | undefined {
  return sections.find((s) => s.slug === slug);
}

export interface NavigationTarget {
  label: string;
  href: string | null;
  /** Set when the destination's content is not yet editorially approved. */
  pending: boolean;
}

/** The career-selection hub that Section 8 leads to and the academies return to. */
const CAREER_SELECTION: NavigationTarget = {
  label: 'Choose a Career Academy',
  href: null,
  pending: true,
};

function target(section: SectionEntry | undefined): NavigationTarget | null {
  if (!section) return null;
  return {
    label: `${section.number}. ${section.title}`,
    href: section.published ? sectionUrl(section) : null,
    pending: !section.published,
  };
}

/**
 * Previous/next model from ultimate-beginners-guide-master-roadmap.md v1.7, section 8:
 *
 *   "Use previous and next links through Sections 0–7. Section 8 leads to career
 *    selection; Career Academies link back to career selection and forward to Section 14;
 *    Sections 14–17 resume previous and next navigation."
 */
export function paginationFor(number: number): {
  prev: NavigationTarget | null;
  next: NavigationTarget | null;
} {
  const CAREER_ACADEMY_NUMBERS = [9, 10, 11, 12, 13];

  // Sections 0–7: straightforward sequence.
  if (number >= 0 && number <= 7) {
    return { prev: target(sectionByNumber(number - 1)), next: target(sectionByNumber(number + 1)) };
  }

  // Section 8 closes the foundation and leads to career selection.
  if (number === 8) {
    return { prev: target(sectionByNumber(7)), next: CAREER_SELECTION };
  }

  // Career Academies are taken in any order: back to selection, forward to the veteran path.
  if (CAREER_ACADEMY_NUMBERS.includes(number)) {
    return { prev: CAREER_SELECTION, next: target(sectionByNumber(14)) };
  }

  // Section 14 rejoins the spine; 14–17 resume ordinary sequence.
  if (number === 14) {
    return { prev: CAREER_SELECTION, next: target(sectionByNumber(15)) };
  }
  if (number >= 15 && number <= 17) {
    return { prev: target(sectionByNumber(number - 1)), next: target(sectionByNumber(number + 1)) };
  }

  return { prev: null, next: null };
}
