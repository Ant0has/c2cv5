import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import DestinationPage from '@/pages-list/directions/DestinationPage';
import places from '@/pages-list/directions/places.json';
import {descriptionFor,destinationSchema,destinationUrl,jsonLd} from '@/pages-list/directions/schema';
export const dynamicParams=false;
export function generateStaticParams(){return places.map(p=>({place:p.slug}));}
export function generateMetadata({params}:{params:{place:string}}):Metadata {
 const p=places.find(p=>p.slug===params.place);if(!p)return {};
 const title=p.title+' — рассчитать и заказать поездку',description=descriptionFor(p),url=destinationUrl(p.slug),image='https://city2city.ru/destination-assets/v1/'+p.slug+'-hero-winter.webp';
 return {title,description,alternates:{canonical:url},robots:{index:true,follow:true},
  openGraph:{type:'website',locale:'ru_RU',siteName:'City2City',title,description,url,images:[{url:image,alt:p.title}]},
  twitter:{card:'summary_large_image',title,description,images:[image]}};
}
export default function Page({params}:{params:{place:string}}){
 const p=places.find(p=>p.slug===params.place);if(!p)notFound();
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(destinationSchema(p))}}/><DestinationPage key={p.slug} page={p}/></>;
}
