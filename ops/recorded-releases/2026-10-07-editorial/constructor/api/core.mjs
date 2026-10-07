import {createHmac, timingSafeEqual, createHash} from 'node:crypto';
import {CLASSES, normalizeCity, ageLabel, childRequirements} from './public/domain.mjs';
import {buildTripDraft, scheduleError} from './public/trip.mjs';
import {normalizePhoneNumber} from './public/phone.mjs';
import {ADDITIONAL_SERVICES, PET_SERVICES} from './public/tariffs.mjs';
export class RequestError extends Error { constructor(message,status=400,code='invalid'){super(message);this.status=status;this.code=code;} }
export function text(value,max,required=false) {
  if(typeof value!=='string'||value.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(value))throw new RequestError('Проверьте заполненные поля.');
  const result=value.trim();if(required&&!result)throw new RequestError('Заполните обязательные поля.');return result;
}
const integer=(v,min,max)=>{if(!Number.isInteger(v)||v<min||v>max)throw new RequestError('Проверьте количество пассажиров и багажа.');return v;};
export const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function signed(value,key){const data=Buffer.from(JSON.stringify(value)).toString('base64url');return data+'.'+createHmac('sha256',key).update(data).digest('base64url');}
export function verified(token,key,now=Date.now()) {
  if(typeof token!=='string'||token.length>12000)throw new RequestError('Обновите расчёт маршрута.',409,'quote-expired');
  const [data,signature,extra]=token.split('.'),expected=createHmac('sha256',key).update(data||'').digest('base64url');
  if(extra||!signature||signature.length!==expected.length||!timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))throw new RequestError('Обновите расчёт маршрута.',409,'quote-expired');
  let value;try{value=JSON.parse(Buffer.from(data,'base64url').toString());}catch{throw new RequestError('Обновите расчёт маршрута.',409,'quote-expired');}
  if(!Number.isFinite(value.expires)||value.expires<now)throw new RequestError('Срок расчёта истёк. Пересчитайте маршрут.',409,'quote-expired');
  return value;
}
export function validateState(input,quote,now=new Date()) {
  if(!input||typeof input!=='object'||Array.isArray(input))throw new RequestError('Проверьте параметры поездки.');
  const from=text(input.from,100,true),to=text(input.to,100,true);
  if(normalizeCity(from)===normalizeCity(to))throw new RequestError('Укажите разные точки маршрута.');
  if(!Object.hasOwn(CLASSES,input.plan))throw new RequestError('Выберите класс автомобиля.');
  const passengers=integer(input.passengers,1,8),children=integer(input.children,0,passengers);
  if(!Array.isArray(input.childAges)||input.childAges.length!==children)throw new RequestError('Укажите возраст каждого ребёнка.');
  const childAges=input.childAges.map(v=>integer(v,0,17));
  const bags=integer(input.bags,0,12),carry=integer(input.carry,0,12),foldedSeats=integer(input.foldedSeats,0,3);
  const extraSeats=integer(input.extraSeats,0,passengers),automatic=childRequirements({children,childAges}).filter(c=>c.childSeat).length;
  if(extraSeats+automatic>passengers)throw new RequestError('Проверьте число детских кресел.');
  if(!Array.isArray(input.services)||input.services.length>8||new Set(input.services).size!==input.services.length||input.services.some(id=>!ADDITIONAL_SERVICES.some(s=>s.id===id&&id!=='child-seat'))||input.services.filter(id=>PET_SERVICES.includes(id)).length>1)throw new RequestError('Проверьте выбранные дополнительные услуги.');
  const note=text(input.note,500),s=input.schedule;
  if(!s||!['unsure','now','scheduled'].includes(s.mode))throw new RequestError('Выберите, когда нужна поездка.');
  const schedule={mode:s.mode,date:s.mode==='scheduled'?text(s.date,10,true):'',time:s.mode==='scheduled'?text(s.time,5,true):''};
  const state={from,to,plan:input.plan,passengers,children,childAges,bags,carry,foldedSeats:input.plan==='minivan'?foldedSeats:0,extraSeats,services:input.services,note,schedule,baggage:bags||carry?'custom':'light',route:null,status:'unsupported'};
  if(quote){
    if(quote.type!=='quote'||normalizeCity(quote.from)!==normalizeCity(from)||normalizeCity(quote.to)!==normalizeCity(to)||!Number.isFinite(quote.km)||quote.km<=0)throw new RequestError('Маршрут изменился. Пересчитайте стоимость.',409,'quote-expired');
    state.route={from,to,km:quote.km,prices:quote.prices,source:quote.source};state.status='ready';
  }
  const error=scheduleError(state,now);if(error)throw new RequestError(error.message);
  return state;
}
const shortServices={ 'child-seat':'Кресло','airport-meeting':'Табличка в аэропорту','rail-meeting':'Встреча у вагона','luggage-help':'Помощь с багажом','pet-carrier':'Животное в переноске','dog-small':'Собака до 10 кг','dog-medium':'Собака 10–20 кг','dog-large':'Собака от 20 кг','extra-address':'Доп. адрес' };
export const escapeHtml=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export function mailPayload(input,state,id) {
  const routeOrder=input.orderContract==='route-v2';
  if(input.orderContract!==undefined&&!routeOrder)throw new RequestError('Обновите страницу заявки.');
  const name=text(input.name,60,true),phone=normalizePhoneNumber(input.phone);
  if([name,state.from,state.to].some(value=>escapeHtml(value).length>200))throw new RequestError('Сократите имя или адрес: слишком много специальных символов.');
  if(!phone)throw new RequestError('Проверьте номер телефона.');
  // A trip request is processed for preparing the requested service, not as a
  // recorded checkbox consent. Legacy forms keep their explicit consent contract.
  if(routeOrder){
    if(input.processingBasis!=='trip-request')throw new RequestError('Обновите страницу заявки.');
  }else if(input.consent!==true)throw new RequestError('Подтвердите согласие на обработку персональных данных.');
  const trip=buildTripDraft(state);
  const lines=[`${trip.requestedClass}; ${state.passengers===8?'8+':state.passengers} пасс.`];
  if(state.route)lines.push(`Маршрут: ${state.route.km} км.`);
  if(state.children)lines.push(`Из них детей: ${state.children} (${state.childAges.map(ageLabel).join(', ')}).`);
  if(state.childAges.includes(0))lines.push('Младенец: своя подходящая автолюлька; согласовать установку.');
  const luggage=[];
  if(state.bags)luggage.push(`${state.bags} чем. 75×48×30 см`);
  if(state.carry)luggage.push(`${state.carry} сум. 45×30×25 см`);
  if(luggage.length)lines.push('Багаж: '+luggage.join('; ')+'.');
  if(trip.foldedSeats)lines.push(`Сложить кресел: ${trip.foldedSeats}.`);
  if(trip.reviewReasons.length){
    const reasons={passengers:'пассажиры',luggage:'багаж','child-placement':'детские кресла'};
    lines.push('Подбор по вместимости: '+trip.reviewReasons.map(reason=>reasons[reason]).join(', ')+'.');
  }
  lines.push(...trip.services.map(s=>`${shortServices[s.id]}${s.quantity>1?' ×'+s.quantity:''}: ${s.referenceAmount} ₽.`));
  const schedule=trip.schedule;
  if(schedule.mode==='scheduled')lines.push(`${schedule.date.split('-').reverse().join('.')}, ${schedule.time}.`);
  else if(schedule.mode==='now')lines.push('Как можно скорее.');
  if(trip.priceFrom!==null)lines.push(`Цена от ${trip.priceFrom} ₽.`);
  if(state.note&&!routeOrder)lines.push('Пожелания: '+state.note);
  // CRM copies only the part before the FIRST '&' to driver/group messages.
  // Keep this delimiter literal (not &amp;); escape all surrounding HTML text.
  // A dispatcher receives the full comment through the unchanged mail/CRM flow.
  const additional_info=routeOrder
    ? (state.note?escapeHtml(state.note)+'\n':'')+'&\nТолько диспетчеру:\n'+escapeHtml(lines.join('\n'))
    : escapeHtml(lines.join('\n'));
  if(additional_info.length>1000)throw new RequestError('Слишком много данных для заявки. Немного сократите пожелания — параметры поездки сохранятся.',400,'note-too-long');
  const body={name:escapeHtml(name),phone,block:'Конструктор поездки · пилот',order_from:escapeHtml(state.from),order_to:escapeHtml(state.to),auto_class:state.plan==='estate'?'Комфорт+':CLASSES[state.plan].label,additional_info,trip_type:schedule.mode==='now'?'Сейчас':schedule.mode==='scheduled'?'Предзаказ':'Уточнить дату',trip_date:schedule.mode==='scheduled'?schedule.date.split('-').reverse().join('.')+' '+schedule.time:undefined,trip_price_from:trip.priceFrom===null?undefined:String(trip.priceFrom),'сurrent_route':'https://city2city.ru/trip-constructor-pilot/'};
  if(routeOrder){
    body.block='Конструктор поездки';
    const page=typeof input.pagePath==='string'&&/^\/(?!\/)[a-zA-Z0-9_\-/.%]*$/.test(input.pagePath)&&input.pagePath.length<400?input.pagePath:'/';
    body['сurrent_route']='https://city2city.ru'+page;
  }
  const attribution=input.attribution||{};
  for(const [field,max] of Object.entries({utm_source:200,utm_medium:200,utm_campaign:500,utm_content:200,utm_term:500,landing_page:500,referrer:500,yclid:50})){
    if(typeof attribution[field]==='string')body[field]=escapeHtml(attribution[field].slice(0,Math.floor(max/6)));
  }
  return {body,trip};
}
