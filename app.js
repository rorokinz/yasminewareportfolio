'use strict';
const seedPosts=[
 {id:'p1',title:'One tip, one better teammate',platform:'TikTok',owner:'Demo creator A',approval:'Approved',status:'Published',caption:'What is one small habit that makes you a better teammate? Share the tip you wish you had learned sooner.',impressions:18000,likes:850,comments:120,shares:160,saves:220},
 {id:'p2',title:'The pre-queue checklist',platform:'Instagram',owner:'Demo creator B',approval:'Approved',status:'Published',caption:'Check in. Agree on a plan. Make space for a reset. Save this for your next session.',impressions:10000,likes:400,comments:50,shares:90,saves:180},
 {id:'p3',title:'Small plays, shared progress',platform:'YouTube Shorts',owner:'Demo creator C',approval:'In review',status:'Draft',caption:'A short creator breakdown focused on communication, not just the highlight.',impressions:0,likes:0,comments:0,shares:0,saves:0}
];
// Published cards carry fictional historical results; the draft has no results.
const seedFeedback=[
 {id:'f1',theme:'Onboarding',text:'I would love a quick explanation of how to start watching esports.',priority:'Normal',status:'New'},
 {id:'f2',theme:'Accessibility',text:'Please include captions and readable text in the short videos.',priority:'Normal',status:'Investigating'},
 {id:'f3',theme:'Community safety',text:'A participant reported targeted harassment during a community activity.',priority:'High',status:'Escalated'}
];
let posts=structuredClone(seedPosts),feedback=structuredClone(seedFeedback);
const $=id=>document.getElementById(id);
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function say(text){$('message').textContent=text;}
function selected(){return posts.filter(p=>$('platform').value==='All'||p.platform===$('platform').value);}
function selectField(card,label,options,value,onChange){const wrap=el('label',label);const input=el('select');options.forEach(v=>{const o=el('option',v);o.value=v;input.append(o);});input.value=value;input.addEventListener('change',()=>onChange(input));wrap.append(input);card.append(wrap);return input;}
function render(){
 const chosen=selected(),stats=Pulse.summarize(chosen);
 $('impressions').textContent=stats.impressions.toLocaleString();$('engagements').textContent=stats.engagements.toLocaleString();$('rate').textContent=stats.rate===null?'N/A':(stats.rate*100).toFixed(2)+'%';$('open').textContent=feedback.filter(f=>f.status!=='Resolved').length;
 $('posts').replaceChildren();$('results-body').replaceChildren();
 chosen.forEach(p=>{
  const c=el('article',undefined,'card');const meta=el('div',undefined,'meta');meta.append(el('span',p.platform),el('span',p.approval,'tag'));c.append(meta,el('h3',p.title),el('p',p.caption));
  selectField(c,'Owner',['Assign owner','Demo creator A','Demo creator B','Demo creator C'],p.owner,input=>{p.owner=input.value;if(p.owner==='Assign owner'&&p.status==='Scheduled')p.status='Draft';render();});
  selectField(c,'Creative approval',['Draft','In review','Approved'],p.approval,input=>{p.approval=input.value;if(p.approval!=='Approved'&&p.status==='Scheduled')p.status='Draft';render();});
  selectField(c,'Workflow status',['Draft','Scheduled','Published'],p.status,input=>{const err=Pulse.schedulingError(p,input.value);if(err){say(err);input.value=p.status;return;}p.status=input.value;say('Workflow updated in this tab.');render();});
  c.append(el('div',`${p.impressions.toLocaleString()} demo impressions · ${Pulse.totalEngagements(p).toLocaleString()} engagements`,'numbers'));$('posts').append(c);
  const tr=el('tr');[p.title,p.platform,p.impressions.toLocaleString(),Pulse.totalEngagements(p).toLocaleString()].forEach(x=>tr.append(el('td',x)));$('results-body').append(tr);
 });
 if(!chosen.length)$('posts').append(el('p','No posts for this platform.'));
 $('feedback-list').replaceChildren();feedback.forEach(f=>{
  const c=el('article',undefined,'card');c.append(el('div',f.theme,'meta'),el('h3',f.priority==='High'?'Needs timely human review':'A player perspective'),el('p',f.text));
  selectField(c,'Priority',['Normal','High'],f.priority,input=>{f.priority=input.value;render();});
  selectField(c,'Review status',['New','Investigating','Escalated','Resolved'],f.status,input=>{f.status=input.value;say('Feedback status updated. Resolution requires human follow-through outside this demo.');render();});$('feedback-list').append(c);
 });
}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!==button.dataset.view);}));
$('platform').addEventListener('change',render);
$('reset').addEventListener('click',()=>{posts=structuredClone(seedPosts);feedback=structuredClone(seedFeedback);$('platform').value='All';$('csv').value='';say('Fictional demo data restored.');render();});
$('export').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([Pulse.exportCSV(selected())],{type:'text/csv;charset=utf-8'}));const a=el('a');a.href=url;a.download='player-pulse-results.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);say('Exported selected demo results.');});
$('csv').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;if(file.size>200000){say('Choose a CSV smaller than 200 KB.');return;}try{const imported=Pulse.importPosts(await file.text());posts=imported;$('platform').value='All';render();say(`Imported ${posts.length} result records. Original feedback remains fictional.`);}catch(e){say(e.message);}});
render();
