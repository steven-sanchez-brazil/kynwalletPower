// @vitest-environment node
import { sastCases, coverageCases } from '../../scripts/controls.cases.mjs';
import { assertSastReport, runSastCheck } from '../../scripts/checkSastReport.mjs';
import {
  assertCoverage,
  normalizeCoverage,
  runCoverageCheck,
} from '../../scripts/checkCoverage.mjs';
sastCases((name, body) => it(name, body), assertSastReport, runSastCheck);
coverageCases((name, body) => it(name, body), assertCoverage, normalizeCoverage, runCoverageCheck);
