import test from 'node:test';
import { coverageCases } from './controls.cases.mjs';
import { assertCoverage, normalizeCoverage, runCoverageCheck } from './checkCoverage.mjs';
coverageCases(test, assertCoverage, normalizeCoverage, runCoverageCheck);
