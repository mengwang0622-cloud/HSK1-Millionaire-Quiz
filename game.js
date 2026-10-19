export const prizes=[100,200,300,500,1000,2000,4000,8000,16000,32000,64000,125000,250000,500000,1000000];
export const money=n=>new Intl.NumberFormat('pl-PL').format(n)+' zł';
export function shuffle(a,rng=Math.random){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
export function prepare(q,rng=Math.random){const order=shuffle(q.choices.map((_,i)=>i),rng);return {...q,choices:order.map(i=>q.choices[i]),correct:order.indexOf(q.correct)};}
export function round(bank,practice='all',rng=Math.random){
 const selected=[];
 for(let stage=1;stage<=3;stage++){
 const difficulty=practice==='all'?stage:Number(practice);
 const available=bank.filter(q=>q.difficulty===difficulty&&!selected.some(x=>x.id===q.id));
 // Prioritize contextual tasks in the middle stage, with one pinyin question.
 let chosen=shuffle(available,rng).slice(0,5);
 if(difficulty===2){const contexts=shuffle(available.filter(q=>q.category!=='pinyin'),rng);const pinyin=shuffle(available.filter(q=>q.category==='pinyin'),rng);chosen=[...contexts.slice(0,4),...pinyin.slice(0,1)];}
 if(chosen.length!==5)throw Error('Za mało pytań');selected.push(...chosen);
 }return selected.map(q=>prepare(q,rng));
}
export function fifty(q,rng=Math.random){return shuffle(q.choices.map((_,i)=>i).filter(i=>i!==q.correct),rng).slice(0,2);}
export function audience(q,hidden=[],rng=Math.random){const votes=[0,0,0,0];const active=[0,1,2,3].filter(i=>!hidden.includes(i));let favored=q.correct;if(rng()<(q.difficulty===3?.3:.08))favored=active.find(i=>i!==q.correct)??q.correct;votes[favored]=55+Math.floor(rng()*20);let rest=100-votes[favored];const others=active.filter(i=>i!==favored);others.forEach((i,k)=>{const value=k===others.length-1?rest:Math.floor(rest*rng());votes[i]=value;rest-=value;});return votes;}
export function friend(q,hidden=[],rng=Math.random){const wrong=[0,1,2,3].filter(i=>i!==q.correct&&!hidden.includes(i));return rng()<(q.difficulty===3?.65:.9)?q.correct:wrong[Math.floor(rng()*wrong.length)];}
export function guarantee(correctCount){return correctCount>=10?32000:correctCount>=5?1000:0;}
