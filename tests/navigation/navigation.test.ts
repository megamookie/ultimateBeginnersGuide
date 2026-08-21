import { describe, it, expect } from 'vitest';
import { paginationFor, sections, groups, sectionUrl, sectionByNumber } from '@/lib/navigation/sections';

/**
 * The previous/next model from ultimate-beginners-guide-master-roadmap.md v1.7, section 8.
 * These assertions encode the approved rules directly so a later refactor cannot quietly
 * change the reader's path through the guide.
 */

describe('section registry', () => {
  it('covers Sections 0 through 17 exactly once', () => {
    const numbers = sections.map((s) => s.number).sort((a, b) => a - b);
    expect(numbers).toEqual(Array.from({ length: 18 }, (_, i) => i));
  });

  it('uses the three approved navigation groups', () => {
    expect(groups.map((g) => g.label)).toEqual(['Foundation', 'Career Academies', 'Veteran Path']);
  });

  it('assigns sections to groups as the roadmap specifies', () => {
    // Universal spine 0–8, career branches 9–13, veteran path 14–17.
    expect(groups.find((g) => g.id === 'foundation')!.sections).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(groups.find((g) => g.id === 'career-academies')!.sections).toEqual([9, 10, 11, 12, 13]);
    expect(groups.find((g) => g.id === 'veteran-path')!.sections).toEqual([14, 15, 16, 17]);
  });

  it('publishes only Section 0 at this milestone', () => {
    const published = sections.filter((s) => s.published).map((s) => s.number);
    expect(published).toEqual([0]);
  });

  it('gives every section a permanent URL, published or not', () => {
    for (const section of sections) {
      expect(sectionUrl(section)).toMatch(/^\/[a-z-]+\/[a-z0-9-]+\/$/);
    }
    expect(sectionUrl(sectionByNumber(0)!)).toBe('/foundation/before-you-launch/');
    expect(sectionUrl(sectionByNumber(9)!)).toBe('/career-academies/pve-combat-academy/');
  });

  it('uses unique slugs', () => {
    const slugs = sections.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('previous/next model', () => {
  it('runs a plain sequence through Sections 0–7', () => {
    expect(paginationFor(0).prev).toBeNull();
    expect(paginationFor(0).next?.label).toBe('1. Your First Session');
    expect(paginationFor(5).prev?.label).toBe('4. Ships and Fitting Fundamentals');
    expect(paginationFor(5).next?.label).toBe('6. Staying Alive in New Eden');
  });

  it('sends Section 8 to career selection', () => {
    expect(paginationFor(8).prev?.label).toBe('7. ISK, Markets, Assets, and Logistics');
    expect(paginationFor(8).next?.label).toBe('Choose a Career Academy');
  });

  it('links each Career Academy back to selection and forward to Section 14', () => {
    for (const number of [9, 10, 11, 12, 13]) {
      expect(paginationFor(number).prev?.label).toBe('Choose a Career Academy');
      expect(paginationFor(number).next?.label).toBe('14. Living Beyond Highsec');
    }
  });

  it('resumes an ordinary sequence through Sections 14–17', () => {
    expect(paginationFor(14).prev?.label).toBe('Choose a Career Academy');
    expect(paginationFor(15).prev?.label).toBe('14. Living Beyond Highsec');
    expect(paginationFor(16).next?.label).toBe('17. The Veteran Capsuleer');
    expect(paginationFor(17).next).toBeNull();
  });

  it('marks an unapproved destination as pending instead of linking to a 404', () => {
    const next = paginationFor(0).next!;
    expect(next.pending).toBe(true);
    expect(next.href).toBeNull();
  });

  it('links a published destination normally', () => {
    const prev = paginationFor(1).prev!;
    expect(prev.pending).toBe(false);
    expect(prev.href).toBe('/foundation/before-you-launch/');
  });
});
