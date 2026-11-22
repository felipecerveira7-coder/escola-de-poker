// Junta src/ num único index.html (é o arquivo publicado como artifact).
const fs=require('fs'),path=require('path');const R=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const js=fs.readdirSync(path.join(__dirname,'../src/js')).filter(f=>f.endsWith('.js')).sort().map(f=>R('src/js/'+f)).join('');
const out=R('src/head.html')+'<style>'+R('src/styles.css')+'</style>'+R('src/body.html')+'<script>'+js+'</script>'+R('src/tail.html');
fs.writeFileSync(path.join(__dirname,'../index.html'),out);console.log('index.html gerado:',(out.length/1024).toFixed(0)+' KB');
