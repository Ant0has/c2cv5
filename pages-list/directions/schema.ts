import type {Place} from './DestinationPage';
import {COMMON_FAQ, GROUPS} from './shared';
import {requisitsData} from '@/shared/data/requisits.data';

const ORIGIN='https://city2city.ru';
export const destinationUrl=(slug:string)=>ORIGIN+'/napravleniya/'+slug;
export const descriptionFor=(p:Place)=>p.seoDescription||p.title+': выберите город отправления, автомобиль и багаж. Расчёт стоимости, детские кресла и поездка до вашего адреса.';
export const jsonLd=(value:unknown)=>JSON.stringify(value).replace(/</g,'\\u003c');
const organization={
 '@type':'Organization','@id':ORIGIN+'/#organization',name:requisitsData.BRAND_NAME,
 url:ORIGIN+'/',telephone:requisitsData.PHONE,email:requisitsData.EMAIL,
};
export function destinationSchema(p:Place){
 const url=destinationUrl(p.slug);
 const breadcrumbs=[['Главная',ORIGIN+'/'],['Направления',ORIGIN+'/napravleniya'],[GROUPS[p.group],ORIGIN+'/napravleniya#'+p.group],[p.name,url]];
 return {'@context':'https://schema.org','@graph':[
  organization,
  {'@type':'WebPage','@id':url+'#webpage',url,name:p.title,description:descriptionFor(p),inLanguage:'ru-RU',
   mainEntity:{'@id':url+'#service'},breadcrumb:{'@id':url+'#breadcrumb'},hasPart:{'@id':url+'#faq'}},
  {'@type':'TaxiService','@id':url+'#service',name:p.title,url,description:descriptionFor(p),
   provider:{'@id':ORIGIN+'/#organization'},areaServed:{'@type':'Place',name:p.name}},
  {'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:breadcrumbs.map(([name,item],i)=>({'@type':'ListItem',position:i+1,name,item}))},
  // These are the same visible answers, not a promise of a search-result enhancement.
  {'@type':'FAQPage','@id':url+'#faq',inLanguage:'ru-RU',mainEntity:[...p.faq,...COMMON_FAQ].map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))},
 ]};
}
export function registrySchema(places:Place[]){
 const url=ORIGIN+'/napravleniya';
 return {'@context':'https://schema.org','@graph':[
  organization,
  {'@type':'CollectionPage','@id':url+'#webpage',url,name:'Направления поездок City2City',inLanguage:'ru-RU',mainEntity:{'@id':url+'#destinations'},breadcrumb:{'@id':url+'#breadcrumb'}},
  {'@type':'ItemList','@id':url+'#destinations',numberOfItems:places.length,itemListElement:places.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.name,url:destinationUrl(p.slug)}))},
  {'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:'Главная',item:ORIGIN+'/'},{'@type':'ListItem',position:2,name:'Направления',item:url}]},
 ]};
}
