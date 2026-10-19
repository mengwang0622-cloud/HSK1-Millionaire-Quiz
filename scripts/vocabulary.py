import json,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
rows=(root/'data/vocabulary.tsv').read_text().splitlines()
def page(i):
 for end,p in [(10,1),(23,2),(37,3),(52,4),(67,5),(81,6),(95,7),(109,8),(124,9),(139,10),(153,11),(163,12)]:
  if i<=end:return p
v=[dict(id=i,hanzi=r.split('|')[0],pinyin=r.split('|')[1],polish=r.split('|')[2],page=page(i)) for i,r in enumerate(rows,1)]
assert len(v)==163
(root/'data/vocabulary.json').write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
