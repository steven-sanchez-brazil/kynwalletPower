import { readFileSync } from 'node:fs';
import { isAbsolute, relative } from 'node:path';
const metrics = ['lines', 'branches', 'functions', 'statements'];
function percentage(metric) {
  if (
    !metric ||
    !Number.isInteger(metric.covered) ||
    !Number.isInteger(metric.total) ||
    metric.covered < 0 ||
    metric.total < 0 ||
    metric.covered > metric.total
  )
    throw new Error('Invalid coverage counters');
  return metric.total === 0 ? null : (metric.covered * 100) / metric.total;
}
export function assertCoverage(candidate, baseline, affected, options) {
  if (
    !candidate?.total ||
    !baseline?.total ||
    !Array.isArray(affected) ||
    !options?.baseSha ||
    !options.candidateSha
  )
    throw new Error('Missing coverage evidence');
  const notApplicable = [];
  const global = {};
  for (const name of metrics) {
    const current = percentage(candidate.total[name]);
    const previous = percentage(baseline.total[name]);
    if (current !== null && (current < 80 || (previous !== null && current < previous)))
      throw new Error('Global coverage below policy');
    if (current === null) notApplicable.push('global:' + name);
    global[name] = current;
  }
  for (const file of affected) {
    if (typeof file !== 'string' || !candidate[file])
      throw new Error('Missing affected file coverage');
    for (const name of metrics) {
      const current = percentage(candidate[file][name]);
      if (current === null) notApplicable.push(file + ':' + name);
      else if (current < 80) throw new Error('Affected file coverage below policy');
    }
  }
  return { checked: affected.length, notApplicable, global };
}
export function normalizeCoverage(report, root = process.cwd()) {
  if (!report || typeof report !== 'object' || Array.isArray(report))
    throw new Error('Invalid coverage report');
  return Object.fromEntries(
    Object.entries(report).map(([path, value]) => [
      (isAbsolute(path) ? relative(root, path) : path).replaceAll('\\', '/'),
      value,
    ]),
  );
}
export function runCoverageCheck(args, read = readFileSync) {
  if (args.length !== 3) throw new Error('Expected candidate, baseline and inventory paths');
  const candidate = JSON.parse(read(args[0], 'utf8'));
  const baseline = JSON.parse(read(args[1], 'utf8'));
  const inventory = JSON.parse(read(args[2], 'utf8'));
  return assertCoverage(
    normalizeCoverage(candidate, inventory.root),
    normalizeCoverage(baseline, inventory.baseRoot),
    inventory.files,
    inventory,
  );
}
