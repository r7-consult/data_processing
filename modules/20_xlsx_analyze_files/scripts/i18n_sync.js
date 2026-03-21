#!/usr/bin/env node
/**
 * i18n_sync.js
 * Synchronize en.json with ru.json adding missing keys.
 * Usage: node scripts/i18n_sync.js [--mark] [--dry] [--sort]
 *   --mark  : prefix newly added English values with "[RU] " marker
 *   --dry   : do not write, just report
 *   --sort  : sort keys alphabetically before writing
 */
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
const mark = args.includes('--mark');
const dry = args.includes('--dry');
const sortKeys = args.includes('--sort');
const baseDir = path.join(__dirname, '..', 'translations');
const ruPath = path.join(baseDir, 'ru.json');
const enPath = path.join(baseDir, 'en.json');
function load(p){ return JSON.parse(fs.readFileSync(p,'utf8')); }
function save(p,obj){ fs.writeFileSync(p, JSON.stringify(obj,null,2)+"\n",'utf8'); }
function main(){
  if(!fs.existsSync(ruPath) || !fs.existsSync(enPath)){ console.error('Missing ru.json or en.json'); process.exit(2); }
  const ru = load(ruPath); const en = load(enPath);
  const added = []; const updated = []; const skipped = []; const extra = [];
  Object.keys(ru).forEach(k=>{
    if(!(k in en)){
      const val = mark ? `[RU] ${ru[k]}` : ru[k];
      en[k] = val;
      added.push(k);
    }
  });
  Object.keys(en).forEach(k=>{ if(!(k in ru)) extra.push(k); });
  let out = en;
  if(sortKeys){ const sorted={}; Object.keys(en).sort().forEach(k=> sorted[k]=en[k]); out=sorted; }
  if(dry){
    console.log('DRY RUN: en.json not written');
  } else {
    save(enPath, out);
  }
  console.log('i18n sync summary');
  console.log('  Added keys   :', added.length);
  if(added.length) console.log('   ->', added.slice(0,20).join(', ') + (added.length>20?' ...':''));
  console.log('  Extra in EN  :', extra.length);
  if(extra.length) console.log('   ->', extra.slice(0,20).join(', ') + (extra.length>20?' ...':''));
  console.log('  Marker used  :', mark);
  console.log('  Sorted       :', sortKeys);
  console.log('  Dry run      :', dry);
}
main();
