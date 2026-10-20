import test from 'node:test';
import { sastCases } from './controls.cases.mjs';
import { assertSastReport, runSastCheck } from './checkSastReport.mjs';
sastCases(test, assertSastReport, runSastCheck);
