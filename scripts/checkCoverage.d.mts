export function assertCoverage(
  candidate: unknown,
  baseline: unknown,
  affected: unknown,
  options: unknown,
): { checked: number };
export function normalizeCoverage(report: unknown, root?: string): unknown;
export function runCoverageCheck(
  args: string[],
  read?: (path: string, encoding: string) => string,
): { checked: number };
