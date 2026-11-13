/* AI-assisted independent prototype. Pure functions shared by browser and tests. */
(function(root){
  'use strict';
  const platforms=['TikTok','Instagram','YouTube Shorts','X'];
  function totalEngagements(post){return ['likes','comments','shares','saves'].reduce((n,k)=>n+Number(post[k]||0),0);}
  function summarize(posts){const impressions=posts.reduce((n,p)=>n+Number(p.impressions),0);const engagements=posts.reduce((n,p)=>n+totalEngagements(p),0);return {impressions,engagements,rate:impressions?engagements/impressions:null};}
  function parseCSV(text){
    text=text.replace(/^\uFEFF/,'');const rows=[];let row=[],field='',quoted=false,closed=false;
    for(let i=0;i<text.length;i++){
      const c=text[i];
      if(quoted){if(c==='"'&&text[i+1]==='"'){field+='"';i++;}else if(c==='"'){quoted=false;closed=true;}else field+=c;}
      else if(c==='"'){if(field||closed)throw Error('Unexpected quote in CSV.');quoted=true;}
      else if(c===','){row.push(field);field='';closed=false;}
      else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);if(row.some(x=>x!==''))rows.push(row);row=[];field='';closed=false;}
      else{if(closed)throw Error('Unexpected text after closing quote.');field+=c;}
    }
    if(quoted)throw Error('Unclosed quote in CSV.');row.push(field);if(row.some(x=>x!==''))rows.push(row);return rows;
  }
  function importPosts(text){
    const rows=parseCSV(text);if(rows.length<2)throw Error('Add a header and at least one post.');
    const fields=['title','platform','impressions','likes','comments','shares','saves'];
    const headers=rows.shift().map(x=>x.trim());if(headers.length!==fields.length||new Set(headers).size!==headers.length||fields.some(f=>!headers.includes(f)))throw Error('Use exactly the seven documented column names.');
    if(rows.length>500)throw Error('Import limit: 500 posts.');
    return rows.map((r,i)=>{
      if(r.length!==headers.length)throw Error(`Row ${i+2}: wrong number of columns.`);
      const p=Object.fromEntries(headers.map((k,j)=>[k,r[j].trim()]));
      if(!p.title||p.title.length>160)throw Error(`Row ${i+2}: use a title of 1-160 characters.`);
      if(!platforms.includes(p.platform))throw Error(`Row ${i+2}: unsupported platform.`);
      for(const k of fields.slice(2)){if(!/^\d+$/.test(p[k])||!Number.isSafeInteger(Number(p[k])))throw Error(`Row ${i+2}: ${k} must be a nonnegative integer.`);p[k]=Number(p[k]);}
      return {...p,id:`import-${i}`,owner:'Assign owner',approval:'Draft',status:'Draft',caption:'Imported results record. Review creative separately.'};
    });
  }
  function csvCell(value){let s=String(value??'');if(/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
  function exportCSV(posts){const keys=['title','platform','impressions','likes','comments','shares','saves'];return [keys.join(','),...posts.map(p=>keys.map(k=>csvCell(p[k])).join(','))].join('\r\n');}
  function schedulingError(post,next){return ['Scheduled','Published'].includes(next)&&(post.approval!=='Approved'||post.owner==='Assign owner')?'Assign an owner and approve the creative before scheduling or marking published.':null;}
  const api={platforms,totalEngagements,summarize,parseCSV,importPosts,exportCSV,schedulingError};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Pulse=api;
})(typeof globalThis!=='undefined'?globalThis:this);
