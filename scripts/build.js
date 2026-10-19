import fs from 'node:fs';
fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist/data',{recursive:true});
for(const f of ['index.html','style.css','app.js','game.js','favicon.svg'])fs.copyFileSync(f,`dist/${f}`);
for(const f of ['questions.json','vocabulary.json'])fs.copyFileSync(`data/${f}`,`dist/data/${f}`);
console.log('Static site ready: dist/');
