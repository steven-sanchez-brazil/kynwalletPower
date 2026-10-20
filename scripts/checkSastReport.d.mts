export function assertSastReport(report: unknown, expected: unknown): { scanned: number };
export function runSastCheck(
  args: string[],
  read?: (path: string, encoding: string) => string,
): { scanned: number };
