import assert from 'node:assert/strict';

export function sastCases(test, assertSastReport, runSastCheck) {
  const expected = ['src/App.tsx'];
  const report = () => ({
    version: '1.177.0',
    results: [],
    errors: [],
    paths: { scanned: ['./src/App.tsx'] },
  });
  test('C1 limpio y completo pasa', () =>
    assert.equal(assertSastReport(report(), expected).scanned, 1));
  test('C1 bloquea hallazgos aunque proceso sea cero', () =>
    assert.throws(() => assertSastReport({ ...report(), results: [{}] }, expected)));
  test('C1 bloquea errores e informe incompleto', () => {
    for (const value of [
      null,
      {},
      { ...report(), errors: [{}] },
      { ...report(), paths: {} },
      { ...report(), paths: { scanned: [] } },
    ])
      assert.throws(() => assertSastReport(value, expected));
  });
  test('C1 exige inventario no vacío y sin rutas desconocidas', () => {
    assert.throws(() => assertSastReport(report(), []));
    assert.throws(() => assertSastReport(report(), ['src/Missing.ts']));
    assert.throws(() => assertSastReport(report(), [null]));
    assert.throws(() => assertSastReport(report(), ['']));
  });
  test('C1 CLI lee dos informes y propaga errores', () => {
    assert.equal(
      runSastCheck(['report', 'expected'], (path) =>
        JSON.stringify(path === 'report' ? report() : expected),
      ).scanned,
      1,
    );
    assert.throws(() => runSastCheck([], () => '{}'));
    assert.throws(() => runSastCheck(['report', 'expected'], () => 'invalid'));
    assert.throws(() => runSastCheck(['package.json', 'package.json']));
  });
}

const metric = (covered = 10, total = 10) => ({ covered, total, pct: (covered / total) * 100 });
const totals = (covered = 10) =>
  Object.fromEntries(
    ['lines', 'branches', 'functions', 'statements'].map((name) => [name, metric(covered)]),
  );
export function coverageCases(test, assertCoverage, normalizeCoverage, runCoverageCheck) {
  const baseline = () => ({ total: totals(), 'src/App.tsx': totals() });
  const candidate = () => ({ total: totals(), 'src/App.tsx': totals() });
  const options = { baseSha: 'base', candidateSha: 'head' };
  test('C2 archivo y global conformes pasan sin redondeo', () =>
    assert.equal(assertCoverage(candidate(), baseline(), ['src/App.tsx'], options).checked, 1));
  test('C2 global alta no compensa archivo afectado bajo', () => {
    const report = candidate();
    report['src/App.tsx'] = totals(7);
    assert.throws(() => assertCoverage(report, baseline(), ['src/App.tsx'], options));
  });
  test('C2 ausencia de base, candidato, SHA o datos falla', () => {
    for (const args of [
      [null, baseline(), ['src/App.tsx'], options],
      [candidate(), null, ['src/App.tsx'], options],
      [candidate(), baseline(), ['src/Missing.ts'], options],
      [candidate(), baseline(), ['src/App.tsx'], {}],
      [candidate(), baseline(), null, options],
    ])
      assert.throws(() => assertCoverage(...args));
  });
  test('C2 regresión global y métricas inconsistentes fallan', () => {
    const report = candidate();
    report.total = totals(9);
    assert.throws(() => assertCoverage(report, baseline(), ['src/App.tsx'], options));
    for (const value of [
      undefined,
      { covered: 11, total: 10 },
      { covered: -1, total: 10 },
      { covered: 1, total: 0 },
      { covered: 1.5, total: 10 },
    ]) {
      const invalid = candidate();
      invalid.total.lines = value;
      assert.throws(() => assertCoverage(invalid, baseline(), ['src/App.tsx'], options));
    }
  });
  test('C2 global bajo umbral no pasa incluso sin archivos afectados', () => {
    const report = candidate();
    report.total = totals(7);
    assert.throws(() => assertCoverage(report, { total: totals(6) }, [], options));
  });
  test('C2 métrica sin denominador es no aplicable, no éxito ficticio', () => {
    const report = candidate();
    report['src/App.tsx'].branches = { total: 0, covered: 0 };
    assert.deepEqual(assertCoverage(report, baseline(), ['src/App.tsx'], options).notApplicable, [
      'src/App.tsx:branches',
    ]);
  });
  test('C2 denominador global vacío queda no aplicable y valida tipo de rutas', () => {
    const report = candidate();
    const base = baseline();
    report.total.branches = { covered: 0, total: 0 };
    base.total.branches = { covered: 0, total: 0 };
    assert.ok(assertCoverage(report, base, [], options).notApplicable.includes('global:branches'));
    assert.equal(assertCoverage(candidate(), base, [], options).checked, 0);
    assert.throws(() => assertCoverage(candidate(), base, [null], options));
    for (const malformed of [null, [], 'invalid'])
      assert.throws(() => normalizeCoverage(malformed));
  });
  test('C2 renombrado se verifica por ruta nueva; diff vacío conserva global', () => {
    const report = candidate();
    report['src/Renamed.tsx'] = report['src/App.tsx'];
    assert.equal(assertCoverage(report, baseline(), ['src/Renamed.tsx'], options).checked, 1);
    assert.equal(assertCoverage(candidate(), baseline(), [], options).checked, 0);
  });
  test('C2 normaliza rutas absolutas y conserva claves relativas', () => {
    assert.deepEqual(
      normalizeCoverage({ total: totals(), '/repo/src/App.tsx': totals() }, '/repo'),
      candidate(),
    );
    assert.deepEqual(normalizeCoverage(candidate(), '/repo'), candidate());
  });
  test('C2 CLI valida referencia y rutas; errores no se silencian', () => {
    const inventory = { baseSha: 'base', candidateSha: 'head', files: ['src/App.tsx'] };
    const read = (path) => JSON.stringify(path === 'inventory' ? inventory : candidate());
    assert.equal(runCoverageCheck(['candidate', 'base', 'inventory'], read).checked, 1);
    assert.throws(() => runCoverageCheck([], read));
    assert.throws(() => runCoverageCheck(['candidate', 'base', 'inventory'], () => 'invalid'));
    assert.throws(() => runCoverageCheck(['package.json', 'package.json', 'package.json']));
  });
}
