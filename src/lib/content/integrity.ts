/**
 * Transport-integrity validation for approved content release files.
 *
 * Three distinct classes of corruption reached this repository inside a single release —
 * double encoded UTF-8, a blank line inserted after every source line, and emphasis markers
 * displaced into a link destination — and the third would have shipped three unreadable
 * tables had the import not noticed. Every one of them was found by inspecting the received
 * bytes, which is what this module does.
 *
 * Corruption is a stop condition: the release is rejected and returned to ChatGPT for a
 * corrected artifact. Claude must not repair an approved source. Everything here therefore
 * *detects and reports*; nothing rewrites.
 *
 * Release-record checksums were removed on August 22, 2026 by user decision. They verified
 * only when ChatGPT happened to supply one, and a missing checksum then halted files that
 * were provably clean. The detectors below need no cooperation from the sender and caught
 * every defect the checksum would have.
 *
 * Every function is pure over a Buffer or string so the whole rule set is unit-testable
 * without a build, a network, or a filesystem.
 */

export type IntegrityCode =
  | 'encoding-not-utf8'
  | 'encoding-bom'
  | 'encoding-crlf'
  | 'mojibake'
  | 'replacement-character'
  | 'markdown-table-interrupted'
  | 'markdown-link-malformed'
  | 'systematic-blank-lines'
  | 'trailing-newline-missing';

export interface IntegrityFailure {
  code: IntegrityCode;
  message: string;
  /** 1-based line number when the defect is locatable. */
  line?: number;
  /** The offending text, trimmed for reporting. */
  evidence?: string;
}

export interface IntegrityResult {
  ok: boolean;
  failures: IntegrityFailure[];
}

const UTF8_BOM = [0xef, 0xbb, 0xbf];

/**
 * Byte-level encoding rules: strict UTF-8, no byte-order mark, LF line endings.
 * A BOM and a CRLF both survive a "valid UTF-8" check, so each is tested separately.
 */
export function checkEncoding(bytes: Buffer | Uint8Array): IntegrityFailure[] {
  const failures: IntegrityFailure[] = [];

  if (bytes.length >= 3 && UTF8_BOM.every((byte, i) => bytes[i] === byte)) {
    failures.push({
      code: 'encoding-bom',
      message: 'File begins with a UTF-8 byte-order mark. Release files must have no BOM.',
    });
  }

  try {
    new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    failures.push({
      code: 'encoding-not-utf8',
      message: 'File does not decode as strict UTF-8.',
    });
    // Everything below assumes decodable text.
    return failures;
  }

  const text = new TextDecoder('utf-8').decode(bytes);
  const carriageReturns = (text.match(/\r/g) ?? []).length;
  if (carriageReturns > 0) {
    failures.push({
      code: 'encoding-crlf',
      message: `File contains ${carriageReturns} carriage return(s). Release files must use LF line endings.`,
    });
  }

  if (text.length > 0 && !text.endsWith('\n')) {
    failures.push({
      code: 'trailing-newline-missing',
      message: 'File does not end with a newline.',
    });
  }

  return failures;
}

/**
 * Sequences produced when UTF-8 bytes are read as Windows-1252 and re-encoded. These are the
 * exact forms seen in the corrupted governance set: em dash, en dash, curly quotes, arrows,
 * a minus sign, and a non-breaking space.
 */
const MOJIBAKE_PATTERNS: Array<{ sequence: string; meant: string }> = [
  { sequence: 'â€”', meant: '— em dash' },
  { sequence: 'â€“', meant: '– en dash' },
  { sequence: 'â€œ', meant: '" opening quote' },
  { sequence: 'â€™', meant: "' apostrophe" },
  { sequence: 'â€˜', meant: "' opening quote" },
  { sequence: 'â€¦', meant: '… ellipsis' },
  { sequence: 'â†’', meant: '→ arrow' },
  { sequence: 'âˆ’', meant: '− minus sign' },
  { sequence: 'Â ', meant: 'non-breaking space' },
  { sequence: 'Ã©', meant: 'é' },
  // The bare `â€` tail catches variants the specific pairs above miss.
  { sequence: 'â€', meant: 'a punctuation character' },
];

export function checkMojibake(text: string): IntegrityFailure[] {
  const failures: IntegrityFailure[] = [];
  const lines = text.split('\n');
  const reported = new Set<string>();

  for (const { sequence, meant } of MOJIBAKE_PATTERNS) {
    const index = text.indexOf(sequence);
    if (index === -1) continue;

    // Only report the most specific match at each position.
    if ([...reported].some((seen) => seen.includes(sequence) || sequence.includes(seen))) continue;
    reported.add(sequence);

    const line = text.slice(0, index).split('\n').length;
    const total = text.split(sequence).length - 1;
    failures.push({
      code: 'mojibake',
      message:
        `Found ${total} occurrence(s) of "${sequence}", which is ${meant} double-encoded. ` +
        `UTF-8 bytes were read as Windows-1252 and re-saved.`,
      line,
      evidence: lines[line - 1]?.trim().slice(0, 120),
    });
  }

  return failures;
}

/** U+FFFD, written as an escape so the detector cannot itself be corrupted in transit. */
const REPLACEMENT_CHARACTER = '\uFFFD';

export function checkReplacementCharacter(text: string): IntegrityFailure[] {
  const index = text.indexOf(REPLACEMENT_CHARACTER);
  if (index === -1) return [];

  const line = text.slice(0, index).split('\n').length;
  const total = text.split(REPLACEMENT_CHARACTER).length - 1;
  return [
    {
      code: 'replacement-character',
      message:
        `Found ${total} Unicode replacement character(s) (U+FFFD). Characters were lost in ` +
        `conversion and cannot be recovered from this file.`,
      line,
      evidence: text.split('\n')[line - 1]?.trim().slice(0, 120),
    },
  ];
}

const isTableRow = (line: string) => /^\s*\|/.test(line);

/**
 * A Markdown table only parses when its rows are consecutive. A single blank line between
 * rows turns the whole table into paragraphs of pipe-delimited text — the defect that would
 * have shipped three broken tables in Section 0.
 */
export function checkMarkdownTables(text: string): IntegrityFailure[] {
  const failures: IntegrityFailure[] = [];
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== '' || !isTableRow(lines[i - 1] ?? '')) continue;

    // A blank line only matters if a table row follows it.
    let next = i + 1;
    while (next < lines.length && lines[next].trim() === '') next++;
    if (next > i + 1) continue; // two or more blanks is a real block break
    if (!isTableRow(lines[next] ?? '')) continue;

    failures.push({
      code: 'markdown-table-interrupted',
      message:
        'A blank line separates two table rows. Markdown will not parse this as a table; ' +
        'it renders as literal pipe-delimited text.',
      line: i + 1,
      evidence: lines[i - 1].trim().slice(0, 120),
    });
  }

  return failures;
}

/**
 * Structural validity of Markdown links and images.
 *
 * Catches the defect seen in Section 0 v1.5 — `](*../index*)`, emphasis markers displaced
 * into the destination — plus empty and whitespace-broken targets.
 */
export function checkMarkdownLinks(text: string): IntegrityFailure[] {
  const failures: IntegrityFailure[] = [];
  const lines = text.split('\n');

  lines.forEach((line, index) => {
    // Skip fenced-code content conservatively: a lone backtick line is rare in these files.
    for (const match of line.matchAll(/!?\[[^\]]*\]\(([^)]*)\)/g)) {
      const target = match[1];

      if (target.trim() === '') {
        failures.push({
          code: 'markdown-link-malformed',
          message: 'Link has an empty destination.',
          line: index + 1,
          evidence: match[0].slice(0, 120),
        });
        continue;
      }

      if (/[*_]/.test(target)) {
        failures.push({
          code: 'markdown-link-malformed',
          message:
            'Link destination contains emphasis markers. The asterisks belong around the ' +
            'link text, not inside the target, and the link will not resolve.',
          line: index + 1,
          evidence: match[0].slice(0, 120),
        });
        continue;
      }

      // A space is only legal before a quoted title.
      if (/\s/.test(target.trim()) && !/^\S+\s+"[^"]*"$/.test(target.trim())) {
        failures.push({
          code: 'markdown-link-malformed',
          message: 'Link destination contains unescaped whitespace.',
          line: index + 1,
          evidence: match[0].slice(0, 120),
        });
      }
    }

    // An unclosed link: text bracket followed by an opening paren that never closes.
    for (const match of line.matchAll(/!?\[[^\]]*\]\([^)]*$/g)) {
      failures.push({
        code: 'markdown-link-malformed',
        message: 'Link destination is not closed before the end of the line.',
        line: index + 1,
        evidence: match[0].slice(0, 120),
      });
    }
  });

  return failures;
}

/**
 * Detect transport that inserted a blank line after every source line.
 *
 * The signature is distinctive: blank and non-blank lines alternate almost perfectly and no
 * two blanks ever sit together. Ordinary Markdown runs about a quarter to a third blank
 * lines and has occasional double breaks, so the 45% floor leaves comfortable headroom.
 * The line-count floor keeps short files from tripping it by coincidence.
 */
export function checkSystematicBlankLines(text: string): IntegrityFailure[] {
  const lines = text.split('\n');
  const meaningful = lines.length > 0 && lines[lines.length - 1] === '' ? lines.slice(0, -1) : lines;
  if (meaningful.length < 30) return [];

  let blank = 0;
  let maxRun = 0;
  let run = 0;

  for (const line of meaningful) {
    if (line.trim() === '') {
      blank++;
      run++;
      if (run > maxRun) maxRun = run;
    } else {
      run = 0;
    }
  }

  const ratio = blank / meaningful.length;
  if (ratio >= 0.45 && maxRun <= 1) {
    return [
      {
        code: 'systematic-blank-lines',
        message:
          `${blank} of ${meaningful.length} lines are blank (${Math.round(ratio * 100)}%) with no ` +
          `two consecutive. Transport inserted a blank line after every source line, which ` +
          `breaks tables and turns tight lists loose.`,
      },
    ];
  }

  return [];
}

/**
 * Full transport-integrity gate for one release file.
 *
 * Runs before any normalisation, transformation, or import. Returns every defect found
 * rather than stopping at the first, so one round-trip to ChatGPT can fix all of them.
 */
export function validateReleaseFile(bytes: Buffer | Uint8Array): IntegrityResult {
  const failures: IntegrityFailure[] = [];

  const encodingFailures = checkEncoding(bytes);
  failures.push(...encodingFailures);

  // Text-level checks need a decodable file.
  if (!encodingFailures.some((f) => f.code === 'encoding-not-utf8')) {
    const text = new TextDecoder('utf-8').decode(bytes);
    failures.push(...checkMojibake(text));
    failures.push(...checkReplacementCharacter(text));
    failures.push(...checkMarkdownTables(text));
    failures.push(...checkMarkdownLinks(text));
    failures.push(...checkSystematicBlankLines(text));
  }

  return { ok: failures.length === 0, failures };
}

/** Human-readable report for the CLI and for stop-condition messages. */
export function formatFailures(file: string, failures: IntegrityFailure[]): string {
  return failures
    .map((failure) => {
      const where = failure.line ? `${file}:${failure.line}` : file;
      const evidence = failure.evidence ? `\n       ${failure.evidence}` : '';
      return `  ✗ [${failure.code}] ${where}\n       ${failure.message}${evidence}`;
    })
    .join('\n');
}
