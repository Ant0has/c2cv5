// Run after publishing a place or adding a known spelling of its route slug.
import fs from 'node:fs';
const root=new URL('../',import.meta.url);
const places=JSON.parse(fs.readFileSync(new URL('pages-list/directions/places.json',root)));
const whitelist=new Set(JSON.parse(fs.readFileSync(new URL('whitelist.json',root))));
const aliases={
  'sheregesh':['sheregesh'], 'arhyz':['arhyz','arkhyz'], 'sochi':['sochi'],
  'listvyanka':['listvyanka'], 'kislovodsk':['kislovodsk'],
  'pereslavl-zalesskiy':['pereslavl-zalesskij','pereslavl-zalesskiy'],
  'sortavala':['sortavala'], 'abzakovo':['abzakovo','novoabzakovo'],
  // Ozernoye alone is ambiguous: only the verified Manzherok route names match.
  'manzherok':['manzherok'], 'gora-sobolinaya':['baykalsk','bajkalsk','baykalsk-gora-sobolinaya'],
  'valday':['valday','valdaj']
};
const rows=places.map(place=>{
  if(!whitelist.has('napravleniya/'+place.slug))throw Error('Unpublished destination: '+place.slug);
  return {slug:place.slug,name:place.name,group:place.group,
    routeSlugs:aliases[place.slug]||[place.slug],
    routes:place.links.map(link=>{const u=new URL(link.url);if(u.origin!=='https://city2city.ru')throw Error('External route');return u.pathname;})};
});
fs.writeFileSync(new URL('pages-list/directions/navigation.generated.json',root),JSON.stringify(rows,null,2)+'\n');
console.log('Destination navigation generated: '+rows.length+' places');
