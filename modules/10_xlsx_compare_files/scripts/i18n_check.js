// Simple localization missing-keys checker (run in browser console or Node with minor tweaks)
(function(){
  if(typeof window==='undefined'){ /* Node usage: require fs */ return; }
  fetch('translations/ru.json').then(r=>r.json()).then(ru=>{
    fetch('translations/en.json').then(r=>r.json()).then(en=>{
      const missingInEn=Object.keys(ru).filter(k=>!(k in en));
      const extraInEn=Object.keys(en).filter(k=>!(k in ru));
      console.log('[i18n] Missing in EN ('+missingInEn.length+'):', missingInEn);
      console.log('[i18n] Extra in EN ('+extraInEn.length+'):', extraInEn);
    }).catch(e=>console.warn('EN load failed', e));
  }).catch(e=>console.warn('RU load failed', e));
})();
