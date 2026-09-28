const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Run actual source with DOM, hooks and mail replaced by local stubs. No network.
const root = path.resolve(__dirname, '..');
const source = file => fs.readFileSync(path.join(root, file), 'utf8');
const jsx = (type, props) => ({ type, props: props || {} });
const noop = () => undefined;
const enums = {
  ButtonTypes: { PRIMARY: 'primary', SECONDARY: 'secondary', LINK: 'link' },
  Blocks: { HUB: 'Хаб', FOOTER: 'Футер' },
  Prices: { COMFORT: 'comfort', COMFORT_PLUS: 'comfort-plus', BUSINESS: 'business', MINIVAN: 'minivan', DELIVERY: 'delivery' },
};
const baseReact = {
  useState: value => [value, noop], useRef: value => ({ current: value }),
  useEffect: noop, useMemo: fn => fn(), useCallback: fn => fn, useContext: () => ({}),
};
function load(file, overrides = {}, globals = {}) {
  const dependencies = {
    react: baseReact,
    'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'Fragment' },
    clsx: Object.assign(() => '', { clsx: () => '' }),
    '@/shared/types/enums': enums,
    '@/shared/data/requisits.data': { requisitsData: { PHONE: '+79000000000' } },
    '@/app/providers': { ModalContext: {} },
    'next/link': 'Link',
    ...overrides,
  };
  const module = { exports: {} };
  const compiled = ts.transpileModule(source(file), {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(compiled, {
    module, exports: module.exports,
    require(name) {
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      if (name.endsWith('.module.scss')) return {};
      throw new Error(`Unexpected dependency ${name} in ${file}`);
    }, ...globals,
  }, { timeout: 2000 });
  return module.exports;
}
function find(node, predicate) {
  if (Array.isArray(node)) {
    for (const child of node) { const result = find(child, predicate); if (result) return result; }
    return undefined;
  }
  if (!node || typeof node !== 'object') return undefined;
  return predicate(node) ? node : find(node.props?.children, predicate);
}
function initializer(file, name, bindings) {
  const text = source(file);
  const tree = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let expression;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(tree) === name) {
      assert.equal(expression, undefined, `Ambiguous handler ${name}`);
      expression = node.initializer.getText(tree);
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  assert.ok(expression, `Missing handler ${name}`);
  const js = ts.transpileModule(`const fn = ${expression}; module.exports = fn;`, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(js, { ...bindings, module, exports: module.exports }, { timeout: 2000 });
  return module.exports;
}

const { normalizePhoneNumber } = load('shared/lib/phone-number.ts');

test('formatted Russian numbers have one canonical payload', () => {
  for (const value of ['+7 (900) 123-45-67', '8 900 123 45 67', '79001234567', '9001234567', '+7\u00a0(900)\u202f123–45–67']) {
    assert.equal(normalizePhoneNumber(value), '+79001234567', value);
  }
});

test('explicit international numbers preserve their country code', () => {
  for (const [input, output] of [
    ['+44 (20) 7946-0958', '+442079460958'], ['00380 50 123 45 67', '+380501234567'],
    ['+1 (202) 555-0100', '+12025550100'], ['+90 555 123 45 67', '+905551234567'],
  ]) assert.equal(normalizePhoneNumber(input), output);
});

test('invalid short, malformed and overlong phone values are rejected', () => {
  for (const input of ['', '   ', '1', '1234567', '+++++++++++', '+7++9001234567', '900123abcd',
    '+7000', '+0123456789', '+1234567890123456', '442079460958', '000', '8/900/123/45/67']) {
    assert.equal(normalizePhoneNumber(input), null, input);
  }
});

test('shared button has native disabled/loading and explicit form type', () => {
  const Button = load('shared/components/ui/Button/Button.tsx').default;
  let clicks = 0;
  for (const props of [{ disabled: true }, { loading: true }]) {
    const rendered = Button({ type: 'primary', htmlType: 'submit', handleClick: () => clicks++, ...props });
    assert.equal(rendered.props.type, 'submit');
    assert.equal(rendered.props.disabled, true);
    rendered.props.onClick();
  }
  assert.equal(clicks, 0);
  const enabled = Button({ type: 'primary', handleClick: () => clicks++ });
  assert.equal(enabled.props.type, 'button');
  enabled.props.onClick();
  assert.equal(clicks, 1);
  const link = Button({ type: 'link', link: 'https://example.org/', ariaLabel: 'Написать' });
  assert.equal(link.props.href, 'https://example.org/');
  assert.equal(link.props['aria-label'], 'Написать');
});

test('all four public forms explicitly retain submit button behavior', () => {
  for (const file of [
    'shared/components/forms/QuestionForm/QuestionForm.tsx',
    'shared/components/forms/OrderForm/OrderForm.tsx',
    'entities/buziness/ui/business-hero/business-hero-form/BusinessHeroForm.tsx',
    'entities/buziness/ui/business-delivery-hero-form/BusinessDeliveryHeroForm.tsx',
  ]) assert.match(source(file), /htmlType="submit"/, file);
});

test('calculator anchor exists before lazy calculator rendering and is not duplicated', () => {
  const Price = load('pages-list/home/ui/Price/Price.tsx', {
    '@/feature/calculator': { CalculatorDefault: 'CalculatorDefault' },
    '@/feature/calculator/ui/trip-constructor/TripConstructor': 'TripConstructor',
    '@/feature/calculator/route-context': { getRoutePoints: () => ({ from: '', to: '' }) },
    '@/shared/layouts/homeLayout/HomeLayout': { HomeLayout: 'HomeLayout', HomeLayoutTitle: 'HomeLayoutTitle' },
    antd: { Tabs: 'Tabs' }, './data': { planLabel: {} }, './PriceContent/PriceContent': 'PriceContent',
  }).default;
  const tree = Price({});
  assert.ok(find(tree, node => node.props.id === 'order'));
  assert.equal(find(tree, node => node.type === 'CalculatorDefault'), undefined);
  assert.equal(find(Price({ withOrderAnchor: false }), node => node.props.id === 'order'), undefined);
  assert.equal((source('pages-list/destination/ui/destination-page/DestinationPage.tsx').match(/withOrderAnchor=\{false\}/g) || []).length, 2);
  assert.doesNotMatch(source('feature/calculator/ui/calculator-default/CalculatorDefault.tsx'), /id="order"/);
  assert.match(source('pages-list/mezhgorod-root/ui/MezhgorodRootPage.tsx'), /<section id="order"/);
});

test('footer calculation link scrolls locally or keeps its working fallback href', () => {
  for (const hasOrder of [true, false]) {
    let prevented = false;
    const scrolls = [];
    const Footer = load('widgets/Footer/ui/FooterNavigation.tsx', {
      react: { ...baseReact, useContext: () => ({ setQuestionModalData: noop }) },
      '@/shared/configs/routes.config': { routesConfig: new Proxy({}, { get: () => () => '/legal' }) },
      '@/shared/services/scroll-to-block': { scrollToBlockById: id => scrolls.push(id) },
    }, { document: { getElementById: () => hasOrder ? {} : null } }).default;
    const link = find(Footer({ route: {} }), node => node.type === 'a' && node.props.children === 'Рассчитать');
    assert.equal(link.props.href, '/mezhgorod#order');
    link.props.onClick({ preventDefault() { prevented = true; } });
    assert.equal(prevented, hasOrder);
    assert.deepEqual(scrolls, hasOrder ? ['order'] : []);
  }
});

test('SVO urgent CTA opens an order without calculator, preserving route scrolling', () => {
  for (const hasOrder of [true, false]) {
    const modals = [], scrolls = [];
    const Sticky = load('pages-list/destination/ui/svo-blocks/SvoStickyMobileCTA.tsx', {
      react: { ...baseReact, useContext: () => ({ setOrderModalData: data => modals.push(data) }) },
    }, { document: { getElementById: () => hasOrder ? { scrollIntoView: data => scrolls.push(data) } : null } }).default;
    const button = find(Sticky(), node => node.type === 'button');
    assert.equal(button.props.type, 'button');
    button.props.onClick();
    assert.equal(scrolls.length, hasOrder ? 1 : 0);
    assert.equal(modals.length, hasOrder ? 0 : 1);
    if (!hasOrder) assert.equal(modals[0].status, true);
  }
});

test('mobile phone link has a single plus and calculator policy is rooted', () => {
  const Header = load('widgets/Header/ui/HeaderPhones.tsx', { '@/public/icons/PhoneIcon': 'PhoneIcon' }).default;
  const link = find(Header({}), node => node.type === 'Link');
  assert.equal(link.props.href, 'tel:+79000000000');
  assert.match(source('feature/calculator/ui/calculator-default/CalculatorDefault.tsx'), /href='\/privacy-policy'/);
});

const heroFile = 'entities/buziness/ui/business-hero/business-hero-form/BusinessHeroForm.tsx';
const deliveryFile = 'entities/buziness/ui/business-delivery-hero-form/BusinessDeliveryHeroForm.tsx';
function makeFormHandler(file, fields, sendMail) {
  const errors = [], notices = [];
  const bindings = {
    normalizePhoneNumber, submittingRef: { current: false }, setIsSubmitting: noop,
    form: { resetFields: noop, setFields: data => errors.push(data) },
    notification: { success: () => notices.push('success'), error: () => notices.push('error') },
    b2bGoals: { formSubmit: noop }, mailService: { sendMail },
    values: fields, setErrors: data => errors.push(data), setValues: noop, initialValues: {},
  };
  if (file === deliveryFile) bindings.validateForm = initializer(file, 'validateForm', { normalizePhoneNumber });
  return { handler: initializer(file, 'handleHeroFormSubmit', bindings), errors, notices };
}
const validFields = { name: 'LOCAL_TEST_ONLY', phone: '+7 (900) 123-45-67', departurePoint: 'LOCAL_FROM', arrivalPoint: 'LOCAL_TO', weight: 'До 10 кг', when: 'Завтра' };

test('both B2B forms send normalized phone, lock duplicates and unlock after success', async () => {
  for (const file of [heroFile, deliveryFile]) {
    const sent = [];
    let resolve;
    const { handler, notices } = makeFormHandler(file, validFields, body => {
      sent.push(body); return new Promise(done => { resolve = done; });
    });
    const pending = handler(validFields);
    await handler(validFields);
    assert.equal(sent.length, 1, file);
    assert.equal(sent[0].phone, '+79001234567');
    assert.equal(sent[0].name, validFields.name);
    resolve({ success: true });
    await pending;
    assert.deepEqual(notices, ['success']);
    const retry = handler(validFields);
    assert.equal(sent.length, 2);
    resolve({ success: true });
    await retry;
  }
});

test('both B2B forms reject malformed phone locally and allow retry after service failure', async () => {
  for (const file of [heroFile, deliveryFile]) {
    let sent = 0;
    const invalid = { ...validFields, phone: '+++++++++++' };
    const { handler, errors } = makeFormHandler(file, invalid, async () => { sent++; });
    await handler(invalid);
    assert.equal(sent, 0);
    assert.ok(errors.length);
    const failed = makeFormHandler(file, validFields, async () => { sent++; throw new Error('Local failure'); });
    await failed.handler(validFields);
    await failed.handler(validFields);
    assert.equal(sent, 2);
    assert.deepEqual(failed.notices, ['error', 'error']);
  }
});
