import { createLiveRuntime } from './live.mjs';
import { ROUTES, CLASSES, PARTY_PRESETS, capacity, money, people, initialState, changePoints, calculateRoute, setPassengers, setChildren, setPartyPreset, setChildAge, childRequirements, ageLabel, quote, fits, hasRoutePoints, travelMinutes, durationLabel } from './domain.mjs';
import { FLEET, photo, exampleModel } from './fleet.mjs';
import { PROFILES, BAG_PRESETS, clampCargo, cargoSummary, cargoSuggestion } from './cargo.mjs';
import { renderCabin, renderCargoPlan } from './cabin.mjs';
import { tariffConditions, ADDITIONAL_SERVICES, CHILD_SEAT_PRICE, selectService, serviceRequests } from './tariffs.mjs';
import { buildTripDraft, tripReview, scheduleError, scheduleLabel } from './trip.mjs';
import { normalizePhoneNumber } from './phone.mjs';
export function mountApp(document,context={}){
const $ = id => document.getElementById(id);
let state = changePoints(initialState('home'), context.from||'', context.to||'');
const runtime = createLiveRuntime({ document, context, getState: () => state, setState: next => { state = next; }, render, syncInputs, announce });
$('constructor').setAttribute('aria-label','Конструктор поездки');
const classButtons = new Map();
const dialogTriggers = new WeakMap();
function showDialog(dialog, trigger) { dialogTriggers.set(dialog, trigger); dialog.showModal(); }
let galleryPlan = '', galleryModel = '', cabinKey = '', cabinResult = null;
const person = child => `<svg class="person-icon${child ? ' child' : ''}" viewBox="0 0 20 30" aria-hidden="true"><circle cx="10" cy="5" r="4"/><path d="M4 29V17H2v-5c0-3 16-3 16 0v5h-2v12h-5v-9H9v9Z"/></svg>`;

function invalidateValidation() { $('demo-success').hidden = true; }
function automaticSeats() { return childRequirements(state).filter(c => c.childSeat).length; }
function createServiceControls(rootId) {
  for (const service of ADDITIONAL_SERVICES) {
    const row = document.createElement('div'), term = document.createElement('dt'), price = document.createElement('dd');
    row.dataset.service = service.id;
    price.textContent = service.amount === 0 ? 'Бесплатно' : money(service.amount);
    if (!service.amount) price.className = 'included';
    if (service.id === 'child-seat') {
      const title = document.createElement('strong'); title.textContent = service.label;
      const status = document.createElement('p'); status.dataset.autoSeats = ''; status.className = 'service-hint';
      const label = document.createElement('label'); label.textContent = 'Дополнительно'; label.className = 'extra-seats-label';
      const select = document.createElement('select'); select.dataset.extraSeats = ''; select.id = rootId + '-extra-seats'; label.htmlFor = select.id;
      select.setAttribute('aria-label', 'Дополнительные детские кресла');
      for (let n = 0; n <= 8; n++) { const option = document.createElement('option'); option.value = n; option.textContent = n === 0 ? 'Не нужны' : String(n); select.append(option); }
      select.addEventListener('change', () => { state.extraSeats = Number(select.value); invalidateValidation(); render(); announce(childSeatSummary()); });
      label.append(select); term.append(title, status, label);
    } else {
      const label = document.createElement('label'), input = document.createElement('input'), text = document.createElement('span');
      input.type = 'checkbox'; input.dataset.serviceInput = service.id; input.id = rootId + '-' + service.id;
      text.textContent = service.label; label.append(input, text); term.append(label);
      input.addEventListener('change', () => { state = selectService(state, service.id, input.checked); invalidateValidation(); render(); announce(serviceText()); });
    }
    row.append(term, price); $(rootId).append(row);
  }
}
createServiceControls('services-list'); createServiceControls('order-services-list');
function selectedServices() { return serviceRequests(state, automaticSeats()); }
function serviceText() {
  const services = selectedServices(), amount = services.reduce((n, s) => n + s.referenceAmount, 0);
  if (!services.length) return 'Допуслуги не выбраны';
  return `Допуслуги по прайсу: ${amount ? money(amount) : 'бесплатно'}${services.some(s => s.id === 'extra-address') ? '. Доплату за изменение маршрута уточним' : ''}. Итог подтвердим.`;
}
function renderServices() {
  const auto = automaticSeats(), remaining = Math.max(0, state.passengers - auto);
  state.extraSeats = Math.min(state.extraSeats || 0, remaining);
  for (const root of [$('services-list'), $('order-services-list')]) {
    root.querySelector('[data-auto-seats]').textContent = auto ? `По возрасту детей: ${auto}. Ориентир ${money(auto * CHILD_SEAT_PRICE)}; тип и наличие подтвердим.` : 'От 1 до 7 лет включительно запрос кресла добавляется по возрасту. До года — своя подходящая автолюлька; для детей старше 7 лет дополнительное кресло можно согласовать здесь.';
    const select = root.querySelector('[data-extra-seats]'); select.value = state.extraSeats;
    for (const option of select.options) option.disabled = Number(option.value) > remaining;
    root.querySelectorAll('[data-service-input]').forEach(input => { input.checked = (state.services || []).includes(input.dataset.serviceInput); input.closest('[data-service]').classList.toggle('service-selected', input.checked); });
    root.querySelector('[data-service="child-seat"]').classList.toggle('service-selected', auto + state.extraSeats > 0);
  }
  const services = selectedServices();
  $('services-count').textContent = services.length ? `· ${services.length}` : '';
  $('services-summary').hidden = !services.length; $('services-summary').textContent = serviceText();
  $('order-services-caption').textContent = services.length ? `Выбрано: ${services.length} · можно изменить` : 'Можно выбрать или изменить';
}
function renderTariff() {
  const conditions=tariffConditions(state.plan);
  $('tariff-title').textContent=`Условия тарифа ${CLASSES[state.plan].label}`;
  $('waiting-price').textContent=money(conditions.waitingHour);
  $('stop-price').textContent=money(conditions.longStop);
  $('estate-tariff-note').hidden=!conditions.provisional;
}

for (const [key, item] of Object.entries(CLASSES)) {
  const button = document.createElement('button');
  button.className = 'class-option'; button.type = 'button'; button.dataset.plan = key;
  button.innerHTML = `<span class="class-name">${item.label}</span><span class="class-capacity">до ${item.capacity} пассажиров</span><img src="${photo(exampleModel(key)[0], 'thumb')}" width="150" height="100" alt="" loading="lazy"><span class="class-price"></span><span class="check-dot" aria-hidden="true">✓</span>`;
  button.addEventListener('click', () => {
    if (!fits(state, key)) { announce(`Для ${people(state.passengers)} этот класс не подходит. Для Комфорт+ и Бизнеса больше трёх пассажиров — выберите минивэн.`); return; }
    state.plan = key; invalidateValidation(); render(); announceSelection();
  });
  $('classes').append(button); classButtons.set(key, button);
}
for (const route of ROUTES) {
  const button = document.createElement('button'); button.type = 'button'; button.textContent = `${route.from} → ${route.to}`;
  button.addEventListener('click', () => { runtime.invalidate(); state = changePoints(state, route.from, route.to); syncInputs(); $('example-list').hidden = true; $('route-examples').setAttribute('aria-expanded', 'false'); render(); runtime.calculate(); });
  $('example-list').append(button);
}
function announce(text) { $('live-status').textContent = text; }
function syncInputs() { $('from').value = state.from; $('to').value = state.to; }
function announceSelection() { announce(`${CLASSES[state.plan].label}, ${people(state.passengers)}. ${!tripReview(state).needsSelection && quote(state) !== null ? 'От ' + money(quote(state)) + ' за автомобиль.' : 'Нужно уточнить параметры поездки.'}`); }
function renderGallery() {
  if (galleryPlan === state.plan) return;
  galleryPlan = state.plan; galleryModel = exampleModel(state.plan)[0];
  $('model-gallery').replaceChildren(...FLEET[state.plan].map(([id,label]) => {
    const button=document.createElement('button');button.type='button';button.textContent=label;button.dataset.model=id;
    button.addEventListener('click',()=>{galleryModel=id;updatePhoto();announce(`На изображении пример: ${label}. Тариф и расчёт багажа класса не меняются.`);});return button;
  }));
  updatePhoto();
}
function updatePhoto() {
  const [id,label]=FLEET[state.plan].find(([id])=>id===galleryModel);
  $('car-image').src=photo(id, 'display');$('car-image').alt=`Пример модели ${label}: автомобиль спереди в три четверти, без номера`;
  $('model-name').textContent=label;
  document.querySelectorAll('[data-model]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.model===id));
}
function renderInterior() {
  const key=[state.plan,state.passengers,state.children,JSON.stringify(state.childAges),state.bags,state.carry,state.foldedSeats].join('|');
  if (key!==cabinKey) {
    cabinKey=key;cabinResult=renderCabin($('cabin-preview'),state);renderCargoPlan($('cargo-plan'),state);
    if($('cabin-dialog').open)renderCabin($('cabin-large'),state);
  }
  const {seats,packing}=cabinResult, suggestion=cargoSuggestion(state);
  $('cabin-title').textContent=`${CLASSES[state.plan].label}: как разместимся`;
  $('cabin-subtitle').textContent=(state.plan==='comfort-plus'?'Hyundai Sonata · седан':PROFILES[state.plan].label)+' · схема класса, не чертёж модели';
  $('seat-caption').textContent=`${seats.occupants.length} из ${seats.limit} мест · водитель отдельно`;
  $('packing-caption').textContent=packing.items.length?`На схеме: ${packing.placed.length} из ${packing.items.length} · оценка`:'Без крупного багажа';
  $('packing-caption').classList.toggle('needs-review',!!packing.unplaced.length);
  $('cargo-basis').textContent=PROFILES[state.plan].basis;
  $('fold-options').hidden=state.plan!=='minivan';$('folded-seats').value=state.foldedSeats;
  $('roof-note').hidden=state.plan!=='estate';
  $('cargo-warning').hidden=!packing.unplaced.length;
  $('cargo-message').textContent=suggestion ? `На схеме не помещается ${packing.unplaced.length} из ${packing.items.length} предметов. Можно рассмотреть другой вариант; реальную укладку подтвердим.` : 'Для этого багажа нужен индивидуальный подбор. Сохраним все вещи в заявке — подберём подходящую машину.';
  $('cargo-recommend').hidden=!suggestion||!packing.unplaced.length||!fits(state);
  $('cargo-recommend').textContent=suggestion?`${suggestion.reason} →`:'';
  $('large-cabin-caption').textContent=$('seat-caption').textContent+' · '+$('packing-caption').textContent;
  for(const type of ['bags','carry']) {
    $(type+'-count').textContent=state[type];$(type+'-less').disabled=state[type]<=0;$(type+'-more').disabled=state[type]>=12;
  }
}
function childSeatSummary() {
  const details=childRequirements(state), seats=selectedServices().find(s => s.id === 'child-seat')?.quantity || 0;
  return [seats ? `Кресел в запросе: ${seats} · по прайсу ${money(seats * CHILD_SEAT_PRICE)}.` : `Кресло по прайсу — ${money(CHILD_SEAT_PRICE)}.`, 'Отдельно от поездки; тип и наличие подтвердим.', 'Кресла предоставляем для детей от 1 до 7 лет включительно.', details.some(child=>child.age===0) ? 'Младенец едет со своей подходящей автолюлькой: её не предоставляем, установку нужно согласовать.' : '', details.some(child=>child.age===null) ? 'Укажите возраст каждого ребёнка.' : ''].filter(Boolean).join(' ');
}
function renderChildAges(rootId) {
  const root=$(rootId), details=childRequirements(state);
  // Preserve the focused select when values change; rebuild only for a new count.
  if(root.children.length!==details.length) {
    root.replaceChildren(...details.map(child=>{
      const row=document.createElement('div');row.className='age-row';
      const id=`${rootId}-${child.index}`, label=document.createElement('label');label.htmlFor=id;label.textContent=`Ребёнок ${child.index+1}`;
      const select=document.createElement('select');select.id=id;select.required=true;select.setAttribute('aria-describedby',`${id}-status`);
      for(const [value,text] of [['','Укажите возраст'],...Array.from({length:18},(_,age)=>[String(age),ageLabel(age)])]) {
        const option=document.createElement('option');option.value=value;option.textContent=text;select.append(option);
      }
      const status=document.createElement('span');status.id=`${id}-status`;status.className='age-status';
      select.addEventListener('change',()=>{state=setChildAge(state,child.index,select.value);$('demo-success').hidden=true;render();announce(childSeatSummary());});
      row.append(label,select,status);return row;
    }));
  }
  details.forEach((child,index)=>{
    const row=root.children[index];row.querySelector('select').value=child.age===null?'':String(child.age);
    row.querySelector('.age-status').textContent=child.childSeat?'Кресло в запросе':child.age===0?'Своя автолюлька — согласовать установку':child.age===null?'Нужен возраст':'Устройство уточним';
    row.classList.toggle('seat-added',child.childSeat);
  });
}
function render() {
  invalidateValidation();
  const selected = CLASSES[state.plan], price = quote(state), compatible = fits(state);
  const ready = price !== null, individual = state.passengers > 7;
  renderServices();
  $('passengers').value = state.passengers; $('passengers').textContent = state.passengers === 8 ? '8+' : state.passengers;
  $('less').disabled = state.passengers <= 1; $('more').disabled = state.passengers >= 8;
  $('with-children').checked = state.children > 0; $('children-box').hidden = state.children === 0;
  $('children').replaceChildren(...Array.from({ length: state.passengers }, (_, i) => { const option = document.createElement('option'); option.value = i + 1; option.textContent = i + 1; return option; }));
  $('children').value = state.children || 1;
  renderChildAges('child-ages');renderChildAges('order-child-ages');
  $('order-children-box').hidden=!state.children;
  $('child-seat-status').textContent=$('order-seat-status').textContent=state.children?childSeatSummary():'';
  document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', button.dataset.mode === state.mode));
  document.querySelectorAll('[data-baggage]').forEach(button => button.setAttribute('aria-pressed', button.dataset.baggage === state.baggage));
  document.querySelectorAll('[data-preset]').forEach(button => { const group = PARTY_PRESETS[button.dataset.preset]; button.setAttribute('aria-pressed', state.passengers === group.passengers && state.children === group.children); });
  for (const [key, button] of classButtons) {
    const amount = quote(state, key);
    button.setAttribute('aria-pressed', key === state.plan && !individual);
    button.setAttribute('aria-disabled', !fits(state, key));
    button.querySelector('.class-price').textContent = amount === null ? 'После расчёта' : 'от ' + money(amount);
    button.querySelector('.class-capacity').textContent=`до ${capacity(state,key)} пассажиров`;
    button.setAttribute('aria-label', `${CLASSES[key].label}, до ${capacity(state,key)} пассажиров${amount === null ? ', цена после расчёта' : ', от ' + money(amount)}${!fits(state, key) ? ', мало мест для вашей компании' : ''}`);
  }
  $('capacity-warning').hidden = compatible;
  $('capacity-message').textContent = state.passengers > 7 ? 'Для 8 и более пассажиров нужен индивидуальный подбор транспорта.' : state.plan==='minivan' ? `После складывания кресел осталось ${capacity(state)} мест. Верните третий ряд, чтобы разместить пассажиров.` : `В классе «${selected.label}» до ${selected.capacity} мест. Для вашей компании предложим минивэн.`;
  $('recommend').textContent=state.plan==='minivan'?'Вернуть пассажирские места →':'Выбрать минивэн →';
  $('recommend').hidden = compatible || state.passengers > 7;
  const minutes=travelMinutes(state);
  $('route-metrics').hidden=minutes===null;$('trip-route-meta').hidden=minutes===null;
  $('route-distance').textContent=minutes===null?'':`${state.route.km} км`;
  $('route-time').textContent=minutes===null?'':`≈ ${durationLabel(minutes)}`;
  $('trip-route-meta').textContent=minutes===null?'':`${state.route.km} км · ≈ ${durationLabel(minutes)} в пути`;
  const status = minutes !== null ? 'Время без учёта пробок и остановок.' : state.status === 'same-points' ? 'Укажите разные точки отправления и прибытия.' : state.status === 'unsupported' ? 'Стоимость требует расчёта. Можно отправить запрос диспетчеру.' : state.status === 'empty' ? 'Укажите города — покажем цену и время в пути.' : 'Маршрут изменён. Рассчитайте новую цену и время.';
  $('route-status').textContent = status;
  $('calculate').hidden = ready; $('route-examples').hidden = true;
  $('calculate').disabled = !state.from.trim() || !state.to.trim();
  $('trip-title').replaceChildren();
  if (state.from.trim() && state.to.trim()) {
    $('trip-title').append(document.createTextNode(state.from.trim() + ' ')); const arrow = document.createElement('span'); arrow.textContent = '→'; arrow.setAttribute('aria-hidden', 'true'); $('trip-title').append(arrow, document.createElement('br'), document.createTextNode(state.to.trim()));
  } else $('trip-title').textContent = 'Куда отправимся?';
  renderGallery();renderInterior();renderTariff();
  const review = tripReview(state), needsSelection = review.needsSelection;
  $('selected-class').textContent = needsSelection ? 'Нужен подбор' : selected.label;
  $('class-description').textContent = needsSelection ? `Желаемый класс: ${selected.label}` : selected.description;
  $('people-icons').innerHTML = Array.from({ length: state.passengers }, (_, i) => person(i >= state.passengers - state.children)).join('');
  $('people-summary').textContent = state.passengers > 7 ? '8+ пассажиров' : people(state.passengers);
  $('baggage-summary').textContent = cargoSummary(state); $('children-summary').hidden = !state.children; $('children-summary').textContent = `Детей: ${state.children}`;
  const notices = [];
  if (state.children) notices.push(childSeatSummary());
  if (cabinResult.seats.childrenNeedingReview) notices.push('Не всех детей удалось показать на задних местах: размещение и кресла требуют подбора.');
  if (state.bags || state.carry) notices.push('Размещение багажа подтвердим.');
  if (state.note.trim()) notices.push('Пожелания добавлены в заявку.');
  $('special-note').hidden = !notices.length; $('special-note').textContent = notices.join(' ');
  $('total-price').classList.toggle('pending', !ready || needsSelection);
  $('price-caption').hidden = !needsSelection;
  $('price-caption').textContent = needsSelection ? 'Места, кресла или багаж требуют подбора' : '';
  if (ready && !needsSelection) {
    $('total-price').textContent = 'от ' + money(price);
  } else $('total-price').textContent = needsSelection ? 'Цена после подбора' : hasRoutePoints(state) ? 'Уточним стоимость' : 'Укажите маршрут';
  $('price-description').textContent = needsSelection ? 'Сохраним ваши параметры и подберём машину' : 'За автомобиль в одну сторону · без допуслуг';
  $('per-person').hidden = !(ready && !needsSelection && state.passengers > 1);
  $('per-person').textContent = `≈ ${money(Math.ceil((price || 0) / state.passengers))} на человека, если разделить`;
  $('order').disabled = $('mobile-order').disabled = !review.canRequest;
  $('order').firstChild.textContent = needsSelection ? 'Запросить подбор ' : !ready ? 'Уточнить стоимость ' : 'Оставить заявку ';
  $('mobile-order').firstChild.textContent = needsSelection ? 'Подобрать ' : !ready ? 'Уточнить ' : 'К заявке ';
  $('mobile-price').textContent = needsSelection ? 'Нужен подбор' : ready ? 'От ' + money(price) : 'Цена по запросу';
  $('mobile-price-unit').hidden = !ready || needsSelection;
  const mobileNote = needsSelection ? 'Параметры сохранятся' : selectedServices().length ? 'Допуслуги отдельно' : '';
  $('mobile-price-note').textContent = mobileNote;
  $('mobile-price-note').hidden = !mobileNote;
  if($('order-dialog').open) { renderSchedule(); updateOrderSummary(); }
  runtime.render();
}
$('from').addEventListener('input', () => { runtime.invalidate(); state = changePoints(state, $('from').value, $('to').value); render(); });
$('to').addEventListener('input', () => { runtime.invalidate(); state = changePoints(state, $('from').value, $('to').value); render(); });
$('swap').addEventListener('click', () => { runtime.invalidate(); state = changePoints(state, state.to, state.from); syncInputs(); render(); announce('Города поменялись местами. Рассчитайте новый маршрут.'); });
$('route-form').addEventListener('submit', event => { event.preventDefault(); runtime.calculate(); });
$('route-examples').setAttribute('aria-expanded', 'false'); $('route-examples').setAttribute('aria-controls', 'example-list');
$('route-examples').addEventListener('click', () => { $('example-list').hidden = !$('example-list').hidden; $('route-examples').setAttribute('aria-expanded', !$('example-list').hidden); });
$('less').addEventListener('click', () => { state = setPassengers(state, state.passengers - 1); render(); announceSelection(); });
$('more').addEventListener('click', () => { state = setPassengers(state, state.passengers + 1); render(); announceSelection(); });
$('with-children').addEventListener('change', event => { state = setChildren(state,event.target.checked ? 1 : 0); render(); announceSelection(); });
$('children').addEventListener('change', event => { state = setChildren(state,Number(event.target.value)); render(); announceSelection(); });
function showCargo(show) { $('cargo-controls').hidden=!show;$('toggle-cargo').setAttribute('aria-expanded',show);$('toggle-cargo').textContent=show?'Свернуть количество багажа −':'Указать количество и размер багажа +'; }
document.querySelectorAll('[data-baggage]').forEach(button => button.addEventListener('click', () => { state.baggage = button.dataset.baggage;Object.assign(state,BAG_PRESETS[state.baggage]);showCargo(state.baggage!=='light');render();announce(cargoSummary(state)); }));
$('toggle-cargo').addEventListener('click',()=>showCargo($('cargo-controls').hidden));
for(const type of ['bags','carry'])for(const [direction,delta] of [['less',-1],['more',1]])$(type+'-'+direction).addEventListener('click',()=>{state[type]=clampCargo(state[type]+delta);state.baggage='custom';render();announce(cargoSummary(state)+'. '+$('packing-caption').textContent);});
$('folded-seats').addEventListener('change',event=>{state.foldedSeats=Number(event.target.value);render();announce($('seat-caption').textContent);});
$('cargo-recommend').addEventListener('click',()=>{const suggestion=cargoSuggestion(state);if(!suggestion)return;state.plan=suggestion.plan;state.foldedSeats=suggestion.foldedSeats;render();announceSelection();});
$('expand-cabin').addEventListener('click',event=>{$('large-cabin-title').textContent=$('cabin-title').textContent;renderCabin($('cabin-large'),state);showDialog($('cabin-dialog'),event.currentTarget);});
$('close-cabin').addEventListener('click',()=>$('cabin-dialog').close());
document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => {
  state = setPartyPreset(state, button.dataset.preset);
  render(); announce(`Состав пассажиров изменён. Класс ${CLASSES[state.plan].label} и багаж сохранены.${fits(state) ? '' : ' Нужно выбрать более вместительный вариант или запросить подбор.'}`);
}));
$('recommend').addEventListener('click', () => { state.plan = 'minivan';state.foldedSeats=0;render(); announceSelection(); });
$('show-tariff').addEventListener('click',()=>{$('additional-services').open=true;$('additional-services').querySelector('summary').focus();$('tariff-title').scrollIntoView({block:'start'});});
$('note').addEventListener('input', event => { state.note = event.target.value; render(); });
$('order-note').addEventListener('input', event => { state.note=event.target.value;$('note').value=state.note;$('demo-success').hidden=true;render(); });
document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => { state = initialState(button.dataset.mode); $('note').value = '';showCargo(false); syncInputs(); render(); announce(button.dataset.mode === 'home' ? 'Пример главной страницы. Выберите маршрут.' : 'Пример страницы маршрута Москва — Санкт-Петербург.'); }));
function updateOrderSummary() {
  const trip = buildTripDraft(state), review = tripReview(state);
  $('order-summary').textContent = [trip.route, `${trip.requestedClass} · ${trip.passengers > 7 ? '8+ пассажиров' : people(trip.passengers)}`, trip.priceFrom === null ? 'Стоимость уточним — без обещанной цены' : `от ${money(trip.priceFrom)} · без допуслуг`, trip.services.length ? serviceText() : ''].filter(Boolean).join('\n');
  $('dialog-title').textContent = review.needsSelection ? 'Подобрать поездку' : trip.priceFrom === null ? 'Уточнить стоимость' : 'Оставить заявку';
  $('order-review').hidden = !review.needsSelection;
  $('order-review').textContent = 'Потребуется подбор по местам, креслам или багажу. Ваши параметры сохранены, подходящую машину и цену согласуем.';
  const details = [trip.route, trip.estimatedTravelMinutes === null ? 'Расстояние и время уточним' : `${trip.distanceKm} км · примерно ${durationLabel(trip.estimatedTravelMinutes)} без пробок и остановок`, `${trip.requestedClass} · ${trip.passengersIsMinimum ? '8+ пассажиров' : people(trip.passengers)}`, scheduleLabel(state), cargoSummary(state)];
  if (trip.bags || trip.carry) details.push('Чемодан 75 × 48 × 30 см; сумка 45 × 30 × 25 см. Это эскиз, реальную укладку подтвердим.');
  if (trip.roofLoad && (trip.bags || trip.carry)) details.push('Универсал: загрузка без полки, возможность крепления и безопасную высоту подтвердим.');
  if (trip.foldedSeats) details.push(`Сложено кресел третьего ряда: ${trip.foldedSeats}. Трансформацию подтвердим.`);
  if (trip.children) details.push('Возраст детей: ' + trip.childAges.map(ageLabel).join(', '));
  details.push(...trip.services.map(service => `${service.label}${service.quantity > 1 ? ' × ' + service.quantity : ''}: ${service.referenceAmount ? money(service.referenceAmount) + ' по прайсу' : 'бесплатно по прайсу'}`));
  if (trip.notes) details.push('Пожелания: ' + trip.notes);
  if (trip.reviewReasons.length) details.push('Нужен индивидуальный подбор. Цена класса не является ценой этой конфигурации.');
  const conditions=tariffConditions(state.plan);
  details.push(`Ожидание при подаче 15 минут — бесплатно. Час ожидания — ${money(conditions.waitingHour)}. Остановка более 15 минут — ${money(conditions.longStop)}.${conditions.provisional ? ' Для Универсала в образце применены условия Комфорт+.' : ''}`, 'Допуслуги отдельно от поездки. Заезд по дополнительному адресу, наличие кресел, машину и итоговую цену подтвердим.');
  $('order-detail-summary').textContent = details.join('\n');
}
function renderSchedule() {
  const schedule = state.schedule, planned = schedule.mode === 'scheduled';
  $('schedule-mode').value = schedule.mode; $('schedule-fields').hidden = !planned;
  $('date').required = $('time').required = planned;
  // Hidden dates must not block the form with a stale min/range error.
  $('date').disabled = $('time').disabled = !planned;
  $('date').value = schedule.date; $('time').value = schedule.time;
  $('date').min = '';
  $('schedule-help').textContent = !planned ? schedule.mode === 'now' ? 'Возможность и время подачи подтвердим. Это не мгновенная бронь.' : 'Дату можно уточнить при подтверждении.' : 'Укажите местное время выезда. Передадим диспетчеру именно указанное время.';
}
function openOrder(event) {
  if (!hasRoutePoints(state)) return;
  runtime.event('order_open');
  renderSchedule(); updateOrderSummary(); $('order-note').value = state.note;
  $('demo-success').hidden = true; $('schedule-error').hidden = true;
  showDialog($('order-dialog'), event.currentTarget); $('name').focus({ preventScroll: true }); $('order-dialog').scrollTop = 0; runtime.render();
}
$('order').addEventListener('click', openOrder); $('mobile-order').addEventListener('click', openOrder);
$('close-dialog').addEventListener('click', () => $('order-dialog').close());
$('about-preview').addEventListener('click', event => showDialog($('about-dialog'), event.currentTarget));
$('close-about').addEventListener('click', () => $('about-dialog').close());
$('try-preview').addEventListener('click', () => $('about-dialog').close());
for (const id of ['schedule-mode', 'date', 'time']) $(id).addEventListener('change', () => {
  state.schedule = { mode: $('schedule-mode').value, date: $('date').value, time: $('time').value };
  $('schedule-error').hidden = true; render();
});
$('demo-order').addEventListener('submit', event => {
  event.preventDefault(); invalidateValidation();
  const name = $('name').value.trim(), phone = normalizePhoneNumber($('phone').value);
  if (!name) { $('name').setCustomValidity('Укажите имя, не только пробелы.'); $('name').reportValidity(); return; }
  if (!phone) { $('phone').setCustomValidity('Проверьте номер. Для другой страны укажите + и код страны.'); $('phone').reportValidity(); return; }
  const error = scheduleError(state);
  if (error) { $('schedule-error').hidden = false; $('schedule-error').textContent = error.message; $(error.field).focus(); return; }
  if (!hasRoutePoints(state)) return;
  runtime.submit({ name, phone });
});
for (const id of ['name', 'phone']) $(id).addEventListener('input', () => { $(id).setCustomValidity(''); invalidateValidation(); });
document.addEventListener('focusin', event => { if (event.target.matches('input,select,textarea')) $('mobile-total').classList.add('input-active'); });
document.addEventListener('focusout', () => { requestAnimationFrame(() => { if (!document.activeElement?.matches('input,select,textarea')) $('mobile-total').classList.remove('input-active'); }); });
for (const dialog of [$('order-dialog'), $('about-dialog'),$('cabin-dialog')]) {
  dialog.addEventListener('click', event => { if (event.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); });
  dialog.addEventListener('close', () => {
    const trigger = dialogTriggers.get(dialog); dialogTriggers.delete(dialog);
    if (trigger?.isConnected && !trigger.disabled && trigger.getClientRects().length) trigger.focus({ preventScroll: true });
  });
}
syncInputs();render();
runtime.bootstrap();

return ()=>runtime.dispose();
}
