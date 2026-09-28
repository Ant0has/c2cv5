import type {Metadata} from 'next';
import Link from 'next/link';
import places from '@/pages-list/directions/places.json';
import {GROUPS as groups} from '@/pages-list/directions/shared';
import {registrySchema,jsonLd} from '@/pages-list/directions/schema';
import '@/pages-list/directions/destinations.css';

export const metadata:Metadata={title:'Направления поездок — курорты, море, озёра и города',description:'Выберите направление трансфера City2City: горнолыжные курорты, морской отдых, озёра, санатории, Золотое и Серебряное кольцо. Рассчитайте поездку до вашего адреса.',alternates:{canonical:'https://city2city.ru/napravleniya'},openGraph:{url:'https://city2city.ru/napravleniya',title:'Направления поездок City2City'}};
const regions=[['Кавказ','kavkaz'],['Байкал','baikal'],['Карелия','karelia'],['Алтай','altai'],['Урал','ural']];

export default function Page(){
 return <div className="c2c-destination">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(registrySchema(places))}}/>
  <div className="container page-register">
   <nav className="breadcrumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><span>Направления</span></nav>
   <h1>Куда отправимся?</h1>
   <p className="intro">К морю, в горы, к озеру или в новый город. Выберите место, а затем соберите поездку для своей компании.</p>
   <nav className="registry-nav" aria-label="Тип отдыха">{Object.entries(groups).map(([id,name])=><a key={id} href={'#'+id}>{name}</a>)}<a href="#summer">Летний отдых</a></nav>
   {Object.entries(groups).map(([id,name])=><section key={id} id={id}>
    <h2>{name}</h2>
    <div className="preview-cards">{places.filter(p=>p.group===id||p.tags.includes(id)).map(p=><Link className="preview-tile" key={p.slug} href={'/napravleniya/'+p.slug}>
     <img src={'/destination-assets/v2/'+p.slug+'-hero-winter.webp'} alt="" width="600" height="340" loading="lazy"/>
     <div><h3>{p.name}</h3><p>{p.region}</p><span>Собрать поездку →</span></div>
    </Link>)}</div>
    {id==='ski'&&<p className="fine-print"><Link href="/gornolyzhka">Все действующие горнолыжные маршруты →</Link></p>}
    {id==='sea'&&<p className="fine-print"><Link href="/morskoj-otdyh">Все действующие маршруты к морю →</Link></p>}
   </section>)}
   <section id="summer">
    <h2>Летний отдых — не только море</h2>
    <p className="intro">Горы без лыж, прогулки у озёр, города колец и санаторный отдых. На странице места можно переключить зимнее и летнее оформление.</p>
    <div className="route-links">{places.map(p=><Link key={p.slug} href={'/napravleniya/'+p.slug}>{p.name} →</Link>)}</div>
   </section>
   <section aria-labelledby="regions-heading">
    <h2 id="regions-heading">Выбрать по региону</h2>
    <div className="region-grid">{regions.map(([name,tag])=><article className="region-card" key={tag} aria-labelledby={'region-'+tag}>
     <h3 id={'region-'+tag}>{name}</h3>
     <ul className="region-destinations">{places.filter(p=>p.tags.includes(tag)||p.group===tag).map(p=><li key={p.slug}>
      <Link href={'/napravleniya/'+p.slug}><span>{p.name}</span><span aria-hidden="true">→</span></Link>
     </li>)}</ul>
    </article>)}</div>
    <p className="fine-print">Золотое и Серебряное кольцо — подборки автомобильных поездок. Экскурсовод, билеты и проживание в трансфер не входят. Серебряное кольцо — направления Северо-Запада, в том числе региона «Серебряное ожерелье России».</p>
   </section>
   <section><Link className="button primary" href="/mezhgorod">Нужен другой маршрут? Рассчитать межгород →</Link></section>
  </div>
 </div>;
}
