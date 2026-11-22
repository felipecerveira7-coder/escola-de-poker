"""Uso único: quebra o index.html em src/ (cabeçalho, css, corpo, js em partes)."""
import re,os,unicodedata,shutil
s=open('index.html',encoding='utf-8').read()
a=s.find('<style>');b=s.find('</style>');c=s.find('<script>');d=s.rfind('</script>')
head,css,body,js,tail=s[:a],s[a+7:b],s[b+8:c],s[c+8:d],s[d+9:]
shutil.rmtree('src',ignore_errors=True);os.makedirs('src/js')
open('src/head.html','w',encoding='utf-8').write(head);open('src/styles.css','w',encoding='utf-8').write(css)
open('src/body.html','w',encoding='utf-8').write(body);open('src/tail.html','w',encoding='utf-8').write(tail)
cuts=[m.start() for m in re.finditer(r'(?m)^/\* ?(=+|-{3,})[^\n]*',js)]
if cuts[0]!=0:cuts=[0]+cuts
cuts.append(len(js))
def slug(t):
    t=re.sub(r'^/\*\s*[=-]+\s*','',t);t=re.split(r'[=\-]{3,}|\*/|:|\(',t)[0]
    t=unicodedata.normalize('NFKD',t).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+','-',t).strip('-')[:40] or 'parte'
for i in range(len(cuts)-1):
    part=js[cuts[i]:cuts[i+1]];first=part.split('\n',1)[0]
    open(f'src/js/{i:03d}-{slug(first)}.js','w',encoding='utf-8').write(part)
print(len(cuts)-1,'partes')
