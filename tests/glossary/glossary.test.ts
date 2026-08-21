import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
// The generator is plain JavaScript so it can run before any build step; describe its
// shape here rather than duplicating the parser in TypeScript.
import { parseGlossary as parseGlossaryUntyped, termAnchor } from '../../scripts/generate-glossary.mjs';

interface ParsedTerm { term: string; definition: string; anchor: string }
interface ParsedCategory { label: string; anchor: string; terms: ParsedTerm[] }
const parseGlossary = parseGlossaryUntyped as (markdown: string) => {
  version: string;
  categories: ParsedCategory[];
};
import { findMatch } from '@/plugins/rehype-glossary';
import { allTerms, autoLinkTerms } from '@/lib/glossary/markup';

const root = join(import.meta.dirname, '../..');
const SOURCE = join(root, 'content-source/glossary.md');

describe('glossary derivation', () => {
  const source = readFileSync(SOURCE, 'utf8');
  const parsed = parseGlossary(source);
  const generated = JSON.parse(readFileSync(join(root, 'src/data/glossary.generated.json'), 'utf8'));

  it('carries every term from the canonical source', () => {
    const sourceRows = source
      .split('\n')
      .filter((line) => line.startsWith('|') && !/^\|\s*Term\s*\|/.test(line) && !/^\|[\s:\-|]+\|$/.test(line));

    expect(parsed.categories.flatMap((c) => c.terms).length).toBe(sourceRows.length);
  });

  it('copies definitions verbatim — never paraphrased', () => {
    for (const category of parsed.categories) {
      for (const entry of category.terms) {
        // The exact "| Term | Definition |" row must exist in the source.
        expect(
          source.includes(`| ${entry.term} | ${entry.definition} |`),
          `definition for "${entry.term}" does not match the source row`
        ).toBe(true);
      }
    }
  });

  it('stays in sync with the committed generated file', () => {
    expect(generated.glossaryVersion).toBe(parsed.version);
    expect(generated.termCount).toBe(parsed.categories.flatMap((c) => c.terms).length);
  });

  it('gives every term a unique, stable anchor', () => {
    const anchors = allTerms.map((entry) => entry.anchor);
    expect(new Set(anchors).size).toBe(anchors.length);
    expect(termAnchor('Skill Point (SP)')).toBe('skill-point-sp');
    expect(termAnchor('Directional scanner (d-scan)')).toBe('directional-scanner-d-scan');
  });

  it('auto-links only unambiguous terms', () => {
    const autoLinked = new Set(autoLinkTerms().map((entry) => entry.term));
    // Ordinary English words must never be auto-linked, or prose fills with noise.
    for (const risky of ['Main', 'Point', 'Grid', 'Tank', 'Fit', 'Client', 'Character', 'Account', 'Standing', 'Contract', 'Logistics']) {
      expect(autoLinked.has(risky), `"${risky}" is too ambiguous to auto-link`).toBe(false);
    }
    expect(autoLinked.has('PLEX')).toBe(true);
    expect(autoLinked.has('Exordium')).toBe(true);
  });
});

describe('glossary term matching', () => {
  it('matches on whole words only', () => {
    expect(findMatch('the alternative plan', 'Alt')).toBeNull();
    expect(findMatch('an alt for industry', 'Alt')).toEqual({ index: 3, length: 3 });
  });

  it('ignores case, because prose and headings differ', () => {
    expect(findMatch('legal multiboxing is permitted', 'Multiboxing')).toEqual({ index: 6, length: 11 });
  });

  it('absorbs a regular plural so no stray letter sits outside the control', () => {
    expect(findMatch('multiple Omega accounts', 'Omega account')).toEqual({ index: 9, length: 14 });
  });

  it('skips a partial hit and keeps looking further along', () => {
    expect(findMatch('reISKy business needs ISK today', 'ISK')).toEqual({ index: 22, length: 3 });
  });

  it('returns null when the term is absent', () => {
    expect(findMatch('nothing relevant here', 'Pochven')).toBeNull();
  });
});
