import fs from 'node:fs';
import {contexts} from '../data/contexts.js';
const vocab=JSON.parse(fs.readFileSync(new URL('../data/vocabulary.json',import.meta.url)));
const bank=[];
for(const v of vocab){
 // Avoid semantically overlapping distractors, homophones and near synonyms.
 const excluded=new Set([...[27,28],...[43,44],...[86,87],...[84,89],...[99,107],...[97,104,108,153],...[12,14],...[13,15],...[29,34]]);
 const candidates=vocab.filter(w=>w.id!==v.id&&w.polish!==v.polish&&!excluded.has(w.id)&&!w.polish.split(';').some(s=>v.polish.split(';').map(x=>x.trim()).includes(s.trim())));
 const distractors=[0,1,2].map((_,i)=>candidates[(v.id*7+i*29)%candidates.length]);
 bank.push({id:`v-${v.id}`,text:'Co oznacza to słowo lub wyrażenie?',chinese:v.hanzi,pinyin:v.pinyin,choices:[v.polish,...distractors.map(w=>w.polish)],correct:0,difficulty:1,category:'słownictwo',sourceIds:[v.id],explanation:`${v.hanzi} (${v.pinyin}) — ${v.polish}. Podręcznik, s. ${v.page}.`});
 if(![16,17,18,21,102,64,132].includes(v.id)) {
 const d=[...new Map(vocab.filter(w=>w.pinyin!==v.pinyin&&w.id!==v.id).map(w=>[w.pinyin,w])).values()];
 bank.push({id:`p-${v.id}`,text:`Który zapis pinyin odpowiada „${v.hanzi}”?`,chinese:v.hanzi,choices:[v.pinyin,...[0,1,2].map((_,i)=>d[(v.id*11+i*31)%d.length].pinyin)],correct:0,difficulty:2,category:'pinyin',sourceIds:[v.id],explanation:`${v.hanzi} czytamy ${v.pinyin}; znaczenie: ${v.polish}. Podręcznik, s. ${v.page}.`});
 }
}
contexts.forEach((r,i)=>bank.push({id:`c-${i+1}`,difficulty:r[0],category:r[1],text:r[2],chinese:r[3],choices:[r[4],...r[5].split('|')],correct:0,explanation:r[6],sourceIds:r[7]}));
fs.writeFileSync(new URL('../data/questions.json',import.meta.url),JSON.stringify(bank,null,2)+'\n');
console.log(`${vocab.length} entries, ${bank.length} questions`);
