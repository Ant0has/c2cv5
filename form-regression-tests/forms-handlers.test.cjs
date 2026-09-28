const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const ts = require('typescript');

// Extract real source handlers; every side effect is a local stub. No React DOM,
// API request, form token, notification UI, CRM lead or message is created.
const front = path.resolve(__dirname, '..');
const paths = {
  question: 'shared/components/forms/QuestionForm/QuestionForm.tsx',
  order: 'shared/components/forms/OrderForm/OrderForm.tsx',
};
function source(file) {
  return fs.readFileSync(path.join(front, file), 'utf8');
}
function tree(file) {
  return ts.createSourceFile(file, source(file), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}
function findOne(file, predicate) {
  const ast = tree(file);
  const matches = [];
  function visit(node) {
    if (predicate(node, ast)) matches.push(node);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  assert.equal(matches.length, 1, `Expected one source node in ${file}`);
  return { node: matches[0], ast };
}
function initializer(file, name) {
  const { node, ast } = findOne(file, (node, ast) => ts.isVariableDeclaration(node) && node.name.getText(ast) === name);
  return node.initializer.getText(ast);
}
function compile(code, bindings = {}) {
  const js = ts.transpileModule(code, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const context = { ...bindings, module: { exports: {} } };
  context.exports = context.module.exports;
  vm.runInNewContext(js, context, { timeout: 1000 });
  return context.module.exports;
}
const { normalizePhoneNumber } = compile(source('shared/lib/phone-number.ts'));
assert.equal(typeof normalizePhoneNumber, 'function');

function harness(kind, overrides = {}) {
  const sent = [];
  const notices = [];
  const closed = [];
  const submittingStates = [];
  const submittingRef = { current: false };
  const bindings = {
    submittingRef,
    normalizePhoneNumber,
    setIsSubmitting(value) { submittingStates.push(value); },
    handleClose(value) { closed.push(value); },
    mailService: { async sendMail(payload) { sent.push(payload); } },
    notification: {
      success(value) { notices.push({ kind: 'success', value }); },
      error(value) { notices.push({ kind: 'error', value }); },
    },
    // Accessing a Form instance would reintroduce the original inline defect.
    form: undefined,
    orderModalData: { status: true },
    dataToSend: undefined,
    addAdditionalInfo: '',
    planLabel: { comfort: 'Комфорт' },
    ...overrides,
  };
  const run = compile(`module.exports = ${initializer(paths[kind], 'handleSubmitForm')};`, bindings);
  return { run, sent, notices, closed, submittingStates, submittingRef, bindings };
}

const contact = { name: 'LOCAL TEST ONLY', phone: '+7 (900) 000-00-00', confirm_email: '' };
function orderValues() {
  return {
    ...contact,
    trip_type: 'Предзаказ',
    trip_date: { format(pattern) { assert.equal(pattern, 'DD.MM.YYYY HH:mm'); return '16.09.2026 12:30'; } },
    additional_info: 'LOCAL TEST DETAILS',
  };
}

test('inline question sends validated contacts without a Form instance', async () => {
  const h = harness('question', { handleClose: undefined });
  await h.run({ ...contact });
  assert.equal(h.sent.length, 1);
  const payload = h.sent[0];
  assert.equal(payload.name, contact.name);
  assert.equal(payload.phone, '+79000000000');
  assert.equal(payload.confirm_email, '');
  assert.equal(payload.type, 'question');
  assert.equal(payload.order_from, 'Не указано');
  assert.equal(payload.order_to, 'Не указано');
  assert.equal(Object.hasOwn(payload, 'status'), false);
  assert.equal(h.notices[0].kind, 'success');
  assert.deepEqual(h.submittingStates, [true, false]);
  assert.equal(h.submittingRef.current, false);
});

test('question keeps route/delivery context, submitted contacts and honeypot', async () => {
  const h = harness('question', {
    form: { getFieldsValue() { throw new Error('Must use validated onFinish values'); } },
    orderModalData: { status: true, name: 'STALE NAME', phone: '+79999999999', order_from: 'LOCAL CONTEXT FROM' },
    dataToSend: { order_from: 'LOCAL FALLBACK FROM', order_to: 'LOCAL FALLBACK TO', deliveryWeight: '10 кг', price: 100 },
    addAdditionalInfo: '\n Вес груза: 10 кг\n Стоимость: 100',
  });
  await h.run({ ...contact, confirm_email: 'LOCAL HONEYPOT' });
  assert.equal(h.sent[0].name, contact.name);
  assert.equal(h.sent[0].phone, '+79000000000');
  assert.equal(h.sent[0].order_from, 'LOCAL CONTEXT FROM');
  assert.equal(h.sent[0].order_to, 'LOCAL FALLBACK TO');
  assert.equal(h.sent[0].additional_info, '\n Вес груза: 10 кг\n Стоимость: 100');
  assert.equal(h.sent[0].confirm_email, 'LOCAL HONEYPOT');
  assert.deepEqual(h.closed, [true]);
});

test('order uses submitted contacts/date and preserves route/vehicle context', async () => {
  const h = harness('order', {
    orderModalData: {
      status: true, name: 'STALE NAME', phone: '+79999999999', order_from: 'LOCAL FROM', order_to: 'LOCAL TO',
      auto_class: 'comfort', trip_price_from: '1000',
    },
  });
  await h.run(orderValues());
  assert.equal(h.sent.length, 1);
  const payload = h.sent[0];
  assert.equal(payload.name, contact.name);
  assert.equal(payload.phone, '+79000000000');
  assert.equal(payload.trip_type, 'Предзаказ');
  assert.equal(payload.trip_date, '16.09.2026 12:30');
  assert.equal(payload.additional_info, 'LOCAL TEST DETAILS');
  assert.equal(payload.order_from, 'LOCAL FROM');
  assert.equal(payload.order_to, 'LOCAL TO');
  assert.equal(payload.auto_class, 'Комфорт');
  assert.equal(payload.trip_price_from, '1000');
  assert.equal(payload.confirm_email, '');
  assert.equal(Object.hasOwn(payload, 'status'), false);
  assert.deepEqual(h.closed, [true]);
});

for (const kind of Object.keys(paths)) {
  const values = () => kind === 'order' ? orderValues() : { ...contact };
  test(`${kind}: concurrent submissions create only one pending send and unlock on success`, async () => {
    let resolve;
    const pending = new Promise((done) => { resolve = done; });
    let calls = 0;
    const h = harness(kind, { mailService: { async sendMail() { calls += 1; await pending; } } });
    const first = h.run(values());
    assert.equal(h.submittingRef.current, true);
    await h.run(values());
    assert.equal(calls, 1);
    resolve();
    await first;
    assert.equal(h.submittingRef.current, false);
    await h.run(values());
    assert.equal(calls, 2);
  });

  test(`${kind}: failed send keeps existing error behavior and permits retry`, async () => {
    let calls = 0;
    const h = harness(kind, { mailService: { async sendMail() { calls += 1; throw new Error('LOCAL STUB FAILURE'); } } });
    const submitted = values();
    await h.run(submitted);
    assert.equal(h.notices.length, 1);
    assert.equal(h.notices[0].kind, 'error');
    assert.equal(h.submittingRef.current, false);
    assert.deepEqual(h.closed, [undefined]);
    assert.deepEqual(h.submittingStates, [true, false]);
    assert.equal(submitted.phone, contact.phone);
    await h.run(submitted);
    assert.equal(calls, 2);
  });

  test(`${kind}: invalid phone is never sent even if handler is called directly`, async () => {
    const h = harness(kind);
    await h.run({ ...values(), phone: '1' });
    assert.equal(h.sent.length, 0);
    assert.equal(h.submittingRef.current, false);
    assert.equal(h.closed.length, 0);
  });

  test(`${kind}: actual phone validator accepts formatting and rejects bad numbers`, async () => {
    const { node, ast } = findOne(paths[kind], (node, ast) => ts.isPropertyAssignment(node) && node.name.getText(ast) === 'validator');
    const validator = compile(`module.exports = ${node.initializer.getText(ast)};`, { normalizePhoneNumber });
    for (const accepted of ['+7 (900) 000-00-00', '8 (900) 000-00-00', '+49 30 1234 5678']) {
      await validator(undefined, accepted);
    }
    for (const rejected of ['1', '+++++++++++', '+7 (900) text', '12345678901234567890']) {
      await assert.rejects(validator(undefined, rejected));
    }
  });

  test(`${kind}: privacy policy uses an absolute root path`, () => {
    assert.match(source(paths[kind]), /href="\/privacy-policy"/);
    assert.doesNotMatch(source(paths[kind]), /href="privacy-policy"/);
  });
}
