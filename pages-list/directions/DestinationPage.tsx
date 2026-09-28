'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {analytics} from '@/shared/services/analytics.service';
import {requisitsData} from '@/shared/data/requisits.data';
import './destinations.css';
import {COMMON_FAQ,GROUPS} from './shared';

export type Place = {slug:string;seoDescription?:string;name:string;title:string;region:string;group:string;tags:string[];ski:boolean;to:string;lookupTo?:string;from:string[];lead:string;winter:string[];summer:string[];arrivalTitle:string;arrival:string[][];feature:string[];faq:string[][];sources:string[][];links:{url:string;label:string}[];routeSlugs?:Partial<Record<string,string>>};

function seasonNow(){const d=new Date(),md=(d.getMonth()+1)*100+d.getDate();return md>=915||md<415?'winter':'summer'}
function seasonCycle(){const d=new Date(),s=seasonNow(),md=(d.getMonth()+1)*100+d.getDate();return `${d.getFullYear()-(s==='winter'&&md<415?1:0)}-${s}`}
const GOALS=new Set(['view','quote_success','quote_error','order_open','order_success','order_error','fallback']);

/** Use the exact published widget/API, including its signed quotes and submission guards. */
function LiveConstructor({page,selection}:{page:Place;selection:{from:string;revision:number}}){
 const host=useRef<HTMLDivElement>(null),contextRef=useRef<any>(null),applyRef=useRef<(()=>void)|null>(null),selectionRef=useRef(selection);
 selectionRef.current=selection;
 useEffect(()=>{
  const element=host.current;if(!element)return;
  let stopped=false,mounting=false,dispose:(()=>void)|undefined,initialized=false;
  const controller=new AbortController();
  const context={from:selectionRef.current.from,to:page.lookupTo||page.to,routeSlug:page.routeSlugs?.[selectionRef.current.from],signal:controller.signal,onEvent:(name:string,values:Record<string,string>={})=>{if(GOALS.has(name))analytics.reachGoal('constructor_'+name,{...values,destination:page.slug});}};
  contextRef.current=context;
  const restore=()=>{dispose?.();dispose=undefined;element.removeAttribute('data-c2c-constructor');};
  const apply=()=>{
   const shadow=element.shadowRoot,from=shadow?.getElementById('from') as HTMLInputElement|null,to=shadow?.getElementById('to') as HTMLInputElement|null;
   if(!from||!to||!dispose)return;
   context.from=selectionRef.current.from;context.to=page.lookupTo||page.to;context.routeSlug=page.routeSlugs?.[context.from];
   // Only change route fields. Passengers, children, baggage, services and notes remain intact.
   from.value=context.from;from.dispatchEvent(new Event('input',{bubbles:true}));
   to.value=context.to;to.dispatchEvent(new Event('input',{bubbles:true}));
   (shadow?.getElementById('calculate') as HTMLButtonElement)?.click();
  };
  applyRef.current=apply;
  const check=async()=>{
   if(stopped||mounting||document.visibilityState==='hidden')return;mounting=true;
   try{
    const response=await fetch('/trip-constructor/api/config',{cache:'no-store',signal:AbortSignal.timeout(7000)});if(!response.ok)throw Error('Configuration unavailable');
    const config=await response.json();if(stopped)return;if(config.enabled!==true){restore();return;}
    if(!dispose){const url='/trip-constructor-widget/v2/mount.mjs';const mod=await import(/* webpackIgnore: true */ url);if(stopped)return;
     context.from=selectionRef.current.from;context.routeSlug=page.routeSlugs?.[context.from];
     const mountedFrom=context.from;const cleanup=await mod.mount(element,context);if(stopped){cleanup();return;}dispose=cleanup;initialized=true;element.setAttribute('data-c2c-constructor','ready');if(mountedFrom!==selectionRef.current.from)apply();
    }
   }catch{if(!dispose&&!stopped&&!initialized)context.onEvent('fallback');}finally{mounting=false;}
  };
  check();const timer=window.setInterval(check,30000);document.addEventListener('visibilitychange',check);
  return()=>{stopped=true;controller.abort();clearInterval(timer);document.removeEventListener('visibilitychange',check);applyRef.current=null;restore();};
 },[page.slug]);
 useEffect(()=>{if(selection.revision>0)applyRef.current?.();},[selection]);
 return <div id="order" ref={host} data-trip-constructor="v2" className="destination-live-constructor"><div className="panel"><h3>Подбираем поездку</h3><p>Здесь появится расчёт маршрута. Если форма не загрузилась, диспетчер поможет с поездкой.</p><a className="button primary" href={'tel:'+requisitsData.PHONE.replace(/[^+\d]/g,'')}>Позвонить диспетчеру</a><p><Link href="/contacts">Контакты и способы связи →</Link></p></div></div>;
}

export default function DestinationPage({page}:{page:Place}){
 const [season,setSeason]=useState<'winter'|'summer'>('winter');
 const [selection,setSelection]=useState({from:page.from[0],revision:0});
 useEffect(()=>{
  const restore=()=>{let chosen=seasonNow();try{const saved=JSON.parse(sessionStorage.getItem('c2c-destination-season')||'null');if(saved?.cycle===seasonCycle()&&['winter','summer'].includes(saved.season))chosen=saved.season;}catch{}setSeason(chosen as 'winter'|'summer')};restore();document.addEventListener('visibilitychange',restore);return()=>document.removeEventListener('visibilitychange',restore);
 },[]);
 const chooseSeason=(next:'winter'|'summer')=>{setSeason(next);try{sessionStorage.setItem('c2c-destination-season',JSON.stringify({season:next,cycle:seasonCycle()}));}catch{}};
 const select=(from:string)=>{setSelection(s=>({from,revision:s.revision+1}));document.getElementById('constructor')?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
 const copy=page[season],assets='/destination-assets/v1/',heroAssets='/destination-assets/v2/';

 const faq=[...page.faq,...COMMON_FAQ];
 return <div className="c2c-destination" data-season={season}>
  <section className="hero" style={{backgroundImage:`url('${heroAssets}${page.slug}-hero-${season}.webp')`}}><div className="container hero-inner">
   <nav className="breadcrumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><Link href="/napravleniya">Направления</Link><span>/</span><Link href={'/napravleniya#'+page.group}>{GROUPS[page.group]}</Link><span>/</span><span>{page.name}</span></nav>
   <div className="hero-copy"><div className="season-switch" role="group" aria-label="Сезон поездки"><button type="button" className="season-option" aria-pressed={season==='winter'} onClick={()=>chooseSeason('winter')}>❄ Зима</button><button type="button" className="season-option" aria-pressed={season==='summer'} onClick={()=>chooseSeason('summer')}>☀ Лето</button></div>
    <p className="eyebrow light">{copy[0]}</p><h1>Трансфер<br/><em>{page.title.replace('Трансфер ','')}</em></h1><p className="hero-lead">{page.lead.split('\n').map((x,i)=><span key={i}>{i>0&&<br/>}{x}</span>)}</p><p className="hero-detail">{copy[1]}</p><a className="button primary" href="#constructor">Собрать свою поездку <span>↗</span></a>
   </div><div className="hero-caption"><span>{season==='winter'?'Зимние поездки':'Летние поездки'}</span><span>Дорога — тоже часть отдыха</span></div>
  </div></section>
  <section className="container section" id="routes"><div className="section-heading"><div><p className="eyebrow">{copy[2]}</p><h2>Откуда вам удобнее?</h2></div><p>Выберите город. Точный адрес и стоимость уточните в конструкторе ниже.</p></div>
   <div className="route-grid">{page.from.map((from,i)=><button type="button" className="route-card" key={from} aria-pressed={selection.from===from} onClick={()=>select(from)}><span className="route-index">0{i+1} / ВАШ МАРШРУТ</span><h3>{from}</h3><p className="road">→ {page.name}</p><strong>Рассчитать →</strong></button>)}</div>
   <nav className="route-links" aria-label="Подробнее о маршрутах">{page.links.map(l=><a key={l.url} href={l.url}>{l.label} ↗</a>)}</nav>
  </section>
  <section className="builder-section" id="constructor"><div className="container"><div className="section-heading"><div><p className="eyebrow">Всё важное — в одной поездке</p><h2>Цена трансфера</h2></div><p>{page.ski?'Лыжи, сноуборд и длинные чехлы укажите в пожеланиях: число и длину.':'Укажите пассажиров, багаж и точные адреса. Допуслуги можно выбрать в заявке.'}</p></div><LiveConstructor page={page} selection={selection}/></div></section>
  <section className="winter-section" id="trip-details" style={{backgroundImage:`url('${assets}${page.slug}-photo-${season}.webp')`}}><div className="container winter-inner"><div className="winter-copy"><p className="eyebrow light">{page.region}</p><h2>{page.feature[0]}</h2><p>{page.feature[1]}</p><ul>{[['Кто едет и какие вещи','Пассажиры, возраст детей, чемоданы и нестандартный багаж.'],['Где встретить и куда привезти','Точные адреса, номер рейса или поезда, пожелания к остановкам.'],['План возвращения','Обратный трансфер с отдельным временем подачи и расчётом.']].map(([title,text],i)=><li key={title}><span>0{i+1}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ul><a className="button light-button" href="#constructor">Собрать свою поездку ↗</a></div></div></section>
  <section className="container section arrival-section"><div className="section-heading"><div><p className="eyebrow">Последние километры тоже важны</p><h2>{page.arrivalTitle}</h2></div><p>Название направления и точный адрес могут означать разные поездки.</p></div><div className="arrival-grid">{page.arrival.map(([tag,title,text],i)=><article key={tag}><span className="card-number">0{i+1} / {tag}</span><h3>{title}</h3><p>{text}</p></article>)}</div><p className="source-links">Полезные сведения о месте: {page.sources.map(([label,url],i)=><span key={url}>{i>0?' · ':''}<a href={url} rel="noopener">{label}</a></span>)}. Билеты, проживание и услуги этих объектов не входят в трансфер.</p></section>
  <section className="faq-section" id="faq"><div className="container faq-layout"><div><p className="eyebrow">Перед поездкой</p><h2>Лучше знать<br/>заранее.</h2><p>Короткие ответы о вашей поездке.</p></div><div className="faq-list">{faq.map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></div></section>
  <section className="container end-cta"><div><p className="eyebrow">Пора планировать поездку</p><h2>Начните с дороги.<br/>Остальное — впереди.</h2></div><a href="#constructor" className="button primary">Подобрать трансфер ↗</a></section>
 </div>;
}
