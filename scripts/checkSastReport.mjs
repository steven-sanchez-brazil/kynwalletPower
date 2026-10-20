import { readFileSync } from 'node:fs';
function canonical(path) {
  if (typeof path !== 'string' || path.length === 0) throw new Error('Invalid SAST path');
  return path.replaceAll('\\', '/').replace(/^\.\//, '');
}
export function assertSastReport(report, expected) {
  if (
    !report ||
    !Array.isArray(report.results) ||
    !Array.isArray(report.errors) ||
    !Array.isArray(report.paths?.scanned)
  )
    throw new Error('Incomplete SAST report');
  if (!Array.isArray(expected) || expected.length === 0) throw new Error('Missing SAST inventory');
  if (report.results.length || report.errors.length)
    throw new Error('SAST findings or analysis errors');
  const scanned = new Set(report.paths.scanned.map(canonical));
  if (expected.some((path) => !scanned.has(canonical(path))))
    throw new Error('SAST omitted applicable files');
  return { scanned: scanned.size };
}
export function runSastCheck(args, read = readFileSync) {
  if (args.length !== 2) throw new Error('Expected report and inventory paths');
  return assertSastReport(JSON.parse(read(args[0], 'utf8')), JSON.parse(read(args[1], 'utf8')));
}
