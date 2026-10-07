import { calculatePublicQuote } from './pricing.mjs';

// A deliberately small offline catalogue, not a new distance engine.
// Distances are public route examples inspected on 21 Sep 2026.
export const ROUTES = [
  { from: 'Москва', to: 'Санкт-Петербург', km: 710 },
  { from: 'Санкт-Петербург', to: 'Москва', km: 720 },
  { from: 'Москва', to: 'Воронеж', km: 520 },
  { from: 'Москва', to: 'Ярославль', km: 270 },
];
export const CLASSES = {
  comfort: { label: 'Комфорт', capacity: 4, description: 'Для повседневных поездок' },
  'comfort-plus': { label: 'Комфорт+', capacity: 3, description: 'Больше комфорта в дороге' },
  estate: { label: 'Универсал', capacity: 4, pricePlan: 'comfort-plus', description: 'Вместительный багажник · тариф Комфорт+' },
  business: { label: 'Бизнес', capacity: 3, description: 'Для особого случая' },
  minivan: { label: 'Минивэн', capacity: 7, description: 'Вместе всей компанией' },
};
export const BAGGAGE = { light: 'Налегке', standard: 'С чемоданами', many: 'Много вещей' };
export const normalizeCity = value => {
  const normalized = value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('ru-RU');
  return ['питер', 'спб', 'санкт петербург'].includes(normalized) ? 'санкт-петербург' : normalized;
};
export const findRoute = (from, to) => ROUTES.find(route => normalizeCity(route.from) === normalizeCity(from) && normalizeCity(route.to) === normalizeCity(to));
export const routeKey = (from, to) => `${normalizeCity(from)}|${normalizeCity(to)}`;
export const money = amount => new Intl.NumberFormat('ru-RU').format(amount) + ' ₽';
// Match the current public calculator: distance rounded up to 10 km, 80 km/h,
// then time rounded up to 30 minutes. This is not routing/traffic data or an ETA.
export const ESTIMATED_SPEED_KMH = 80;
export function estimateTravelMinutes(km) {
  if (!Number.isFinite(km) || km <= 0) return null;
  return Math.ceil((Math.ceil(km / 10) * 10 / ESTIMATED_SPEED_KMH) * 60 / 30) * 30;
}
export function travelMinutes(state) {
  if (state.status !== 'ready' || !state.route || routeKey(state.from,state.to) !== routeKey(state.route.from,state.route.to)) return null;
  return estimateTravelMinutes(state.route.km);
}
export function durationLabel(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) return '';
  const rounded = Math.round(minutes), days = Math.floor(rounded / 1440), hours = Math.floor(rounded / 60) % 24, remainder = rounded % 60;
  return [days ? `${days} дн` : '', hours ? `${hours} ч` : '', remainder ? `${remainder} мин` : ''].filter(Boolean).join(' ');
}
export function people(count) {
  const last = count % 10, lastTwo = count % 100;
  return `${count} ${last === 1 && lastTwo !== 11 ? 'пассажир' : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? 'пассажира' : 'пассажиров'}`;
}
export function initialState(mode = 'route') {
  return { mode, from: mode === 'route' ? ROUTES[0].from : '', to: mode === 'route' ? ROUTES[0].to : '', route: mode === 'route' ? ROUTES[0] : null, passengers: 2, children: 0, childAges: [], plan: 'comfort', baggage: 'light', bags: 0, carry: 0, foldedSeats: 0, services: [], extraSeats: 0, schedule: { mode: 'unsure', date: '', time: '' }, note: '', status: mode === 'route' ? 'ready' : 'empty' };
}
export function changePoints(state, from, to) {
  return { ...state, from, to, route: null, status: from.trim() || to.trim() ? 'dirty' : 'empty' };
}
export function calculateRoute(state) {
  if (!state.from.trim() || !state.to.trim()) return { ...state, route: null, status: 'empty' };
  if (normalizeCity(state.from) === normalizeCity(state.to)) return { ...state, route: null, status: 'same-points' };
  const route = findRoute(state.from, state.to);
  return route ? { ...state, from: route.from, to: route.to, route, status: 'ready' } : { ...state, route: null, status: 'unsupported' };
}
export function setPassengers(state, value) {
  const passengers = Math.max(1, Math.min(8, Number.isFinite(value) ? Math.round(value) : 1));
  const next = setChildren({ ...state, passengers }, state.children);
  return { ...next, extraSeats: Math.min(next.extraSeats || 0, Math.max(0, passengers - childRequirements(next).filter(c => c.childSeat).length)) };
}
// These controls describe people only. Never change a tariff, luggage or folding.
export const PARTY_PRESETS = { couple: { passengers: 2, children: 0 }, family: { passengers: 4, children: 2 }, company: { passengers: 6, children: 0 } };
export function setPartyPreset(state, preset) {
  const group = PARTY_PRESETS[preset];
  return group ? setChildren(setPassengers(state, group.passengers), group.children) : state;
}
export function hasRoutePoints(state) {
  return Boolean(state.from.trim() && state.to.trim() && normalizeCity(state.from) !== normalizeCity(state.to));
}
// Full years, not birthdays. Unknown is distinct from an infant (age 0).
export const normalizeChildAge = value => {
  if (value === null || value === undefined || value === '' || typeof value === 'boolean') return null;
  const age = Number(value);
  return Number.isInteger(age) && age >= 0 && age <= 17 ? age : null;
};
export function childRequirements(state) {
  return Array.from({ length: state.children }, (_, index) => {
    const age = normalizeChildAge(state.childAges?.[index]);
    return { index, age, childSeat: age !== null && age >= 1 && age <= 7, ownInfantCarrier: age === 0 };
  });
}
export const ageLabel = age => age === null ? 'возраст не указан' : age === 0 ? 'до 1 года' : `${age} ${age === 1 ? 'год' : age >= 2 && age <= 4 ? 'года' : 'лет'}`;
export function setChildren(state, value) {
  const children = Math.max(0, Math.min(state.passengers, Number.isFinite(value) ? Math.round(value) : 0));
  return { ...state, children, childAges: Array.from({ length: children }, (_, i) => normalizeChildAge(state.childAges?.[i])) };
}
export function setChildAge(state, index, value) {
  if (!Number.isInteger(index) || index < 0 || index >= state.children) return state;
  const next = setChildren(state, state.children);
  next.childAges[index] = normalizeChildAge(value);
  return next;
}
export function quote(state, plan = state.plan) {
  if (!CLASSES[plan] || state.status !== 'ready' || !state.route || routeKey(state.from, state.to) !== routeKey(state.route.from, state.route.to)) return null;
  const published = state.route.prices?.[plan];
  if (state.route.prices) return Number.isFinite(published) && published > 0 ? published : null;
  return Number.isFinite(published) && published > 0 ? published : calculatePublicQuote(state.route.km, CLASSES[plan].pricePlan || plan).price;
}
export const capacity = (state, plan = state.plan) => plan === 'minivan' ? 7 - Math.max(0, Math.min(3, state.foldedSeats || 0)) : CLASSES[plan]?.capacity || 0;
export const fits = (state, plan = state.plan) => state.passengers <= capacity(state, plan);
export function draft(state) {
  const childrenDetails = childRequirements(state);
  const estimatedTravelMinutes = travelMinutes(state);
  return { route: `${state.from} → ${state.to}`, distanceKm: estimatedTravelMinutes === null ? null : state.route.km, estimatedTravelMinutes, travelTimeApproximate: true, passengers: state.passengers, children: state.children, childAges: childrenDetails.map(child => child.age), childSeats: childrenDetails.filter(child => child.childSeat).length, childAgesMissing: childrenDetails.filter(child => child.age === null).length, class: state.passengers > 7 ? 'Индивидуальный подбор' : CLASSES[state.plan].label, luggage: BAGGAGE[state.baggage] || 'Свой набор', bags: state.bags, carry: state.carry, foldedSeats: state.plan === 'minivan' ? state.foldedSeats : 0, roofLoad: state.plan === 'estate', priceFrom: fits(state) ? quote(state) : null, notes: state.note, confirmationRequired: true, sent: false };
}
