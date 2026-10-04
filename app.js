'use strict';
(() => {
  const lesson = document.querySelector('#lesson');
  const next = document.querySelector('#next');
  const back = document.querySelector('#back');
  const motion = document.querySelector('#motion');
  const titles = ['How TikTok picks your next video', 'Your actions leave clues.', 'Which video might you watch next?', 'TikTok shows you new content, to see if you like it', 'Try changing your interests.'];
  const topics = ['cooking', 'basketball', 'space'];
  const names = {cooking:'Cooking', basketball:'Basketball', space:'Space'};
  const videoTitles = {cooking:['Quick cooking','One-pan dinner'],basketball:['Basketball tricks','Practice your jump shot'],space:['A look at space','Why the Moon changes shape']};
  const descriptions = {cooking:'A pan of colorful vegetables', basketball:'A basketball near an outdoor hoop', space:'A telescope under the night sky'};
  // A small, deterministic teaching model. These rules are not TikTok's weights.
  const choices = {};
  let screen = 0;
  let mixed = false;
  let explored = '';
  let currentTopic = 'space';
  let history = [];
  let preferences = [];
  let latestAction = null;
  let sorted = false;
  let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const announce = text => { document.querySelector('#announcement').textContent = text; };
  const card = (type, title, tag, extra = '') => `<article class="video ${extra}"><img src="assets/${type}.png" alt="${descriptions[type]}" width="600" height="400"><div class="card-text"><span class="card-title">${title}</span>${tag ? `<span class="tag ${extra === 'fresh' ? 'blue' : ''}">${tag}</span>` : ''}</div></article>`;
  function heading(kicker, subtitle) { return `<div class="enter"><span class="eyebrow">${kicker}</span><h1 id="screen-title">${titles[screen]}</h1><p class="subtitle">${subtitle}</p></div>`; }
  function reactionButtons(type, scope) {
    return `<div class="reactions" aria-label="React to ${names[type]}">${['watch','like','skip'].map(action=>`<button data-topic="${type}" data-action="${action}" data-scope="${scope}" aria-label="${{watch:'Watch',like:'Like',skip:'Skip'}[action]} ${names[type]}" ${scope==='notice' ? `aria-pressed="${choices[type]===action}"` : ''}>${{watch:'Watch it',like:'Like it',skip:'Skip it'}[action]}</button>`).join('')}</div>`;
  }
  function clueText(type) {
    return {watch:'You watched to the end.', like:'You liked this video.', skip:'You moved on quickly.'}[choices[type]] || 'Choose an action below the video.';
  }
  function topicOrder() {
    const liked = topics.filter(t=>choices[t]==='like');
    const watched = topics.filter(t=>choices[t]==='watch');
    const unseen = topics.filter(t=>!choices[t]);
    const skipped = topics.filter(t=>choices[t]==='skip');
    return [...liked,...watched,...unseen,...skipped];
  }
  function rankCard(type) {
    const reason = {watch:'You watched this topic',like:'You liked this topic',skip:'You skipped this topic'}[choices[type]] || 'A topic you could explore';
    return `<article class="rank-card" data-video="${type}"><img src="assets/${type}.png" alt="" width="84" height="65"><div><h3>${videoTitles[type][0]}</h3><p>${reason}</p></div></article>`;
  }
  function seedExperiment() {
    preferences = topicOrder().filter(t=>choices[t]==='watch'||choices[t]==='like');
    if(explored==='watch'||explored==='like') preferences=['space',...preferences.filter(t=>t!=='space')];
    if(explored==='skip') preferences=preferences.filter(t=>t!=='space');
    history=[];latestAction=null;currentTopic='space';
  }
  function suggestions() {
    const favorites = preferences.length ? preferences : topics.filter(t=>!latestAction||t!==latestAction.topic);
    const first = favorites[0] || 'cooking';
    const lastReaction = t => [...history].reverse().find(item=>item.topic===t)?.action || (t==='space' && explored ? explored : choices[t]);
    const variety = preferences.find(t=>t!==first) || topics.find(t=>t!==first && lastReaction(t)!=='skip') || topics.find(t=>t!==first);
    return preferences.length ? [first,first,variety] : [first,variety,topics.find(t=>t!==first&&t!==variety)];
  }
  function suggestionMarkup() {
    return suggestions().map((type,i)=>`<article class="suggestion enter"><img src="assets/${type}.png" alt="${descriptions[type]}" width="160" height="105"><div><h3>${videoTitles[type][i===1?1:0]}</h3><span>${i===2 ? 'Try something different' : preferences.length ? 'From your recent choices' : 'Something to try'}</span></div></article>`).join('');
  }
  function historyMarkup() {
    return history.length ? history.slice(-4).map(item=>`<div class="history-item"><img src="assets/${item.topic}.png" alt="" width="56" height="40"><span>${names[item.topic]}<b>${{watch:'Watched',like:'Liked',skip:'Skipped'}[item.action]}</b></span></div>`).join('') : '<p class="history-empty">Your choices will appear here.</p>';
  }
  function experiment() {
    return `<div class="stage experiment-stage"><section class="try-video"><p class="rank-label">1. Choose a video</p><div class="topic-tabs" aria-label="Choose a video topic">${topics.map(t=>`<button data-pick="${t}" aria-pressed="${currentTopic===t}">${names[t]}</button>`).join('')}</div><div id="active-video">${card(currentTopic,videoTitles[currentTopic][0],'')}</div><div id="experiment-reactions">${reactionButtons(currentTopic,'experiment')}</div></section><section class="next-feed"><p class="rank-label">2. See what could come next</p><div id="suggestions">${suggestionMarkup()}</div><p id="change-caption" class="change-caption">${latestAction ? actionExplanation(latestAction) : 'Choose Watch, Like, or Skip to change this feed.'}</p></section></div><div class="choice-history"><span class="history-title">Your recent choices</span><div id="history-items">${historyMarkup()}</div><button id="reset-experiment" class="quiet">Reset choices</button></div><p class="takeaway">Each video gives TikTok fresh information about what holds your attention.</p>`;
  }
  function actionExplanation(item) {
    return item.action==='skip' ? `You skipped ${names[item.topic].toLowerCase()}. Other topics move forward.` : `You ${item.action==='like'?'liked':'watched'} ${names[item.topic].toLowerCase()}. More of that topic moves forward.`;
  }
  const views = [
    () => `${heading('A peek behind your feed', 'Follow a video from your first swipe to your next recommendation.')}<div class="stage intro-stage"><div class="intro-copy enter"><h2>Your feed learns<br>from what you do.</h2><p>See how TikTok uses your choices and other information to pick videos for your For You feed.</p><div class="mini-steps"><span>Choose videos</span><span>See what changes</span><span>Try a new interest</span></div></div><div class="intro-cards">${card('basketball','Basketball','Worth a watch?')}${card('cooking','Quick cooking','A possible match')}${card('space','A look at space','Something new')}</div></div><p class="note">An interactive teaching example based on public explanations of TikTok.</p>`,
    () => `${heading('01 / Your choices', 'Try different actions. Your choices carry into the next screen.')}<div class="stage clue-stage"><div class="watch-cards">${['cooking','basketball'].map(type=>`<div class="watch-option ${choices[type]?'selected':''} ${choices[type]==='skip'?'skip':''}" id="${type}-option">${card(type,videoTitles[type][0],'')}<div class="watch-progress" aria-hidden="true"><span></span></div>${reactionButtons(type,'notice')}</div>`).join('')}</div><aside class="clue-panel"><h2>What TikTok sees</h2>${['cooking','basketball'].map(type=>`<div class="clue-row ${choices[type]?'revealed':''}" id="${type}-clue"><strong>${names[type]}</strong><span>${clueText(type)}</span></div>`).join('')}<p class="note">Your choices teach TikTok what you might like</p></aside></div><div class="takeaway"><strong>Time spent watching matters, too.</strong> You can teach the system without tapping Like.</div>`,
    () => `${heading('02 / Compare', 'Your activity, video details, and context help sort the options.')}<div class="stage rank-stage"><div class="inputs"><article class="input"><h3>Your activity</h3><p>Watch time, likes, shares, skips.</p></article><article class="input"><h3>Video details</h3><p>Sounds, hashtags, views.</p></article><article class="input"><h3>Your context</h3><p>Language, location, device.</p></article></div><div class="engine"><h2>Compare<br>the clues</h2><button id="sort">Sort using my choices</button></div><div><p class="rank-label" id="rank-label">Before sorting</p><div class="ranking" id="ranking">${['basketball','space','cooking'].map(rankCard).join('')}</div></div></div><div class="takeaway"><strong>What you do usually matters more.</strong><button id="change-choices" class="quiet">Change my choices</button></div>`,
    () => `${heading('03 / Discover', 'A new topic gives TikTok another way to learn what interests you.')}<div class="stage mix-stage"><div class="feed-row" id="feed-row">${card('cooking','Quick cooking','Familiar interest')}${mixed?card('space','A look at space','Something new','fresh'):card('cooking','One-pan dinner','Another cooking video')}${card('basketball','Basketball','Another topic')}</div><div class="discovery-controls" id="discovery-controls">${mixed?`<span id="discovery-response">${explored?`You ${explored==='skip'?'skipped':explored==='like'?'liked':'watched'} the space video.`:'Would you watch the space video?'}</span>${reactionButtons('space','discover')}`:'<button id="mix" class="primary">Try a new topic</button>'}</div></div><div class="takeaway"><strong>Recommendation rules also shape the feed.</strong> Some videos are not eligible to appear here.</div>`,
    () => `${heading('04 / Try it yourself', 'Watch or skip a few videos. See how the next suggestions change.')}${experiment()}`,
  ];
  function render(focus = true) {
    sorted=false;
    lesson.innerHTML = views[screen]();
    lesson.setAttribute('aria-labelledby','screen-title');
    document.querySelector('#counter').textContent=`${screen+1} / 5`;
    document.querySelector('#steps').innerHTML=titles.map((title,i)=>`<button class="step-dot" aria-label="Screen ${i+1}: ${title}" ${i===screen?'aria-current="step"':''} data-step="${i}"></button>`).join('');
    back.disabled=screen===0;
    next.textContent=screen===4?'Start again':screen===0?"Let's begin":'Next';
    if(focus){lesson.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
    announce(`Screen ${screen+1} of 5. ${titles[screen]}`);
  }
  function updateExperiment() {
    document.querySelectorAll('[data-pick]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pick===currentTopic)));
    document.querySelector('#active-video').innerHTML=card(currentTopic,videoTitles[currentTopic][0],'');
    document.querySelector('#experiment-reactions .reactions').setAttribute('aria-label','React to ' + names[currentTopic]);
    // Keep action controls in place so keyboard focus survives consecutive choices.
    document.querySelectorAll('[data-scope="experiment"]').forEach(button=>{
      button.dataset.topic=currentTopic;
      button.setAttribute('aria-label',`${{watch:'Watch',like:'Like',skip:'Skip'}[button.dataset.action]} ${names[currentTopic]}`);
    });
    document.querySelector('#suggestions').innerHTML=suggestionMarkup();
    document.querySelector('#history-items').innerHTML=historyMarkup();
    document.querySelector('#change-caption').textContent=latestAction?actionExplanation(latestAction):'Choose Watch, Like, or Skip to change this feed.';
  }
  lesson.addEventListener('click',e=>{
    const button=e.target.closest('button');if(!button)return;
    const {action,topic,scope,pick}=button.dataset;
    if(action && scope==='notice'){
      choices[topic]=action;
      const option=document.getElementById(`${topic}-option`);
      option.classList.add('selected');option.classList.toggle('skip',action==='skip');
      option.querySelectorAll('[data-action]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.action===action)));
      const row=document.getElementById(`${topic}-clue`);row.classList.add('revealed');row.querySelector('span').textContent=clueText(topic);
      announce(`${names[topic]}: ${clueText(topic)}`);return;
    }
    if(button.id==='sort'&&!sorted){
      sorted=true;
      const container=document.querySelector('#ranking');
      const old=new Map([...container.children].map(el=>[el,el.getBoundingClientRect().top]));
      const order=topicOrder();order.forEach(type=>container.appendChild(container.querySelector(`[data-video="${type}"]`)));
      [...container.children].forEach(el=>{if(!reduced)el.animate([{transform:`translateY(${old.get(el)-el.getBoundingClientRect().top}px)`},{transform:'translateY(0)'}],{duration:850,easing:'cubic-bezier(.22,1,.36,1)'});});
      container.firstElementChild.classList.add('best');
      document.querySelector('#rank-label').textContent=Object.keys(choices).length?'Based on your choices':'Try some choices on screen 2';
      button.textContent='Sorted';button.disabled=true;
      announce(`${names[order[0]]} is first in this example feed.`);return;
    }
    if(button.id==='change-choices'){screen=1;render();return;}
    if(button.id==='mix'){
      mixed=true;
      document.querySelector('#feed-row').children[1].outerHTML=card('space','A look at space','Something new','fresh');
      document.querySelector('#discovery-controls').innerHTML=`<span id="discovery-response">Would you watch the space video?</span>${reactionButtons('space','discover')}`;
      document.querySelector('[data-scope="discover"]').focus({preventScroll:true});
      announce('A space video joins the feed. Choose whether to watch, like, or skip it.');return;
    }
    if(action&&scope==='discover'){
      explored=action;
      document.querySelectorAll('[data-scope="discover"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.action===action)));
      const text=action==='skip'?'You skipped space. Try another interest on the next screen.':'You showed interest in space. Take it into the next screen.';
      document.querySelector('#discovery-response').textContent=text;announce(text);return;
    }
    if(pick){currentTopic=pick;updateExperiment();announce(`${names[pick]} video selected.`);return;}
    if(action&&scope==='experiment'){
      latestAction={topic,action};history.push(latestAction);
      preferences=preferences.filter(t=>t!==topic);
      if(action!=='skip')preferences.unshift(topic);
      updateExperiment();announce(actionExplanation(latestAction));return;
    }
    if(button.id==='reset-experiment'){preferences=[];history=[];latestAction=null;currentTopic='space';updateExperiment();announce('Your example feed has been reset.');}
  });
  function go(index){if(index===4&&screen!==4)seedExperiment();screen=index;render();}
  function resetAll(){Object.keys(choices).forEach(k=>delete choices[k]);mixed=false;explored='';preferences=[];history=[];latestAction=null;currentTopic='space';}
  next.onclick=()=>{if(screen===4){resetAll();go(0);}else go(screen+1);};
  back.onclick=()=>{if(screen>0)go(screen-1);};
  document.querySelector('#replay').onclick=()=>{
    if(screen===1)Object.keys(choices).forEach(k=>delete choices[k]);
    if(screen===3){mixed=false;explored='';}
    if(screen===4)seedExperiment();
    render();
  };
  document.querySelector('#steps').onclick=e=>{const b=e.target.closest('[data-step]');if(b)go(Number(b.dataset.step));};
  function setMotion(){document.documentElement.classList.toggle('reduced',reduced);motion.textContent=reduced?'Motion: off':'Motion: on';motion.setAttribute('aria-pressed',String(reduced));}
  motion.onclick=()=>{reduced=!reduced;setMotion();announce(reduced?'Motion turned off.':'Motion turned on.');};
  document.addEventListener('keydown',e=>{
    if(e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
    if(e.key==='ArrowRight'){e.preventDefault();next.click();}
    if(e.key==='ArrowLeft'){e.preventDefault();back.click();}
    if(e.key==='Home'){e.preventDefault();go(0);}
  });
  setMotion();render(false);
})();

