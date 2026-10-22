/* Last Ferry Courier — original game, MIT licence. Copyright 2026 brodyga45. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Courier = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const stops = Object.freeze({
    depot:{name:'Depot',x:95,y:250}, market:{name:'Market',x:280,y:130},
    garden:{name:'Garden',x:280,y:380}, tower:{name:'Clock tower',x:465,y:250},
    lighthouse:{name:'Lighthouse',x:650,y:105}, station:{name:'Station',x:650,y:395},
    ferry:{name:'Ferry',x:825,y:250}
  });
  Object.values(stops).forEach(Object.freeze);
  const roads = Object.freeze([
    ['depot','market',2],['depot','garden',2],['market','tower',2],['garden','tower',2],
    ['market','lighthouse',4],['tower','lighthouse',2],['tower','station',2],
    ['garden','station',3],['station','ferry',2],['lighthouse','ferry',3],['tower','ferry',4]
  ].map(Object.freeze));
  const roadCatalog = Object.freeze([...roads,Object.freeze(['garden','ferry',1])]);
  const chapters = [
    {title:'The evening post',budget:14,opening:'The last boat is waiting. You tighten the strap on three parcels and look at the roads.',brief:'Three promises before the ferry leaves. Compare roads: the shortest-looking line is not always the quickest way.',note:'Deliver at Market, Garden and Lighthouse, then reach Ferry. Thinking time is free.',
      jobs:[{stop:'market',name:'Bread',detail:'For the evening stall',icon:'▱',story:'Warm bread for the market stall. The last customer gets dinner.'},{stop:'garden',name:'Letter',detail:'Familiar handwriting',icon:'✉',story:'A letter for the gardener. She recognises the handwriting and smiles.'},{stop:'lighthouse',name:'Lamp',detail:'A light for the bay',icon:'☼',story:'A new lamp for the keeper. A warm light returns to the bay.'}],
      ending:'Three promises kept. From the ferry you can see the market lights and the keeper waving. Tomorrow, the harbour will know your footsteps.'},
    {title:'Before the gate closes',budget:14,opening:'The gardener called from the gate. Tonight, the order of your deliveries matters.',brief:'The gardener is leaving early. Her parcel must arrive within four travel minutes. The other deliveries still need you.',note:'Garden deadline: arrive with at least 10 minutes left. A delivery made on time stays safe while you finish the route.',
      jobs:[{stop:'market',name:'Tea',detail:'For the night-shift stall',icon:'▱',story:'The stallholder puts the kettle on. A cup will be waiting for you tomorrow.'},{stop:'garden',name:'Medicine',detail:'Arrive by travel minute 4',deadline:4,icon:'✉',story:'You reach the garden before the gate closes. The gardener can leave with what she needs.'},{stop:'lighthouse',name:'Supper',detail:'For the keeper',icon:'☼',story:'The keeper has been watching the weather all evening. Supper arrives warm enough to share.'}],
      ending:'The garden gate is closed now, but you were there in time. The night shift has its tea and the keeper has supper. You found room for everyone.'},
    {title:'A light across the water',budget:12,opening:'The keeper’s lamp is dark. Across the water, a shorter way home waits for its light.',brief:'A storm has closed the Market–Lighthouse road. Deliver the keeper’s lamp to reveal the one-minute Garden–Ferry footbridge. The ferry leaves in twelve travel minutes.',note:'The dashed footbridge opens after the Lighthouse delivery. Its cost is 1 minute. The storm road stays closed.',
      jobs:[{stop:'market',name:'Oilcloth',detail:'Keep the stall dry',icon:'▱',story:'The stallholder pulls the oilcloth over the last crates. One less thing for the storm to take.'},{stop:'garden',name:'Hot meal',detail:'For the gardener’s return',icon:'✉',story:'A hot meal is waiting when the gardener returns. She saves you a place by the stove for tomorrow.'},{stop:'lighthouse',name:'Storm lamp',detail:'Opens the footbridge',icon:'☼',story:'The keeper raises the new lamp. Its beam reveals the footbridge from Garden to Ferry: one travel minute, now open.'}],
      ending:'The last ferry turns for home. Behind you: a dry market, a meal on the table and a light across the water. Three evenings taught you the harbour; tonight, the harbour brought you home.'}
  ];
  for (const c of chapters) { c.jobs.forEach(Object.freeze); Object.freeze(c.jobs); Object.freeze(c); }
  Object.freeze(chapters);
  function chapter(value) {
    const index=typeof value==='number'?value:value?.chapter??0;
    if (!Number.isInteger(index)||index<0||index>=chapters.length) throw new RangeError('Unknown evening');
    return chapters[index];
  }
  function create(index=0) {
    const c=chapter(index);
    return {chapter:index,phase:'ready',at:'depot',minutes:c.budget,delivered:[],history:[{stop:'depot',cost:0}],message:c.opening,failure:null};
  }
  function start(index=0) { return {...create(index),phase:'playing'}; }
  function roadStates(state) {
    return roadCatalog.map(([a,b,cost],i)=>{
      const bridge=i===roads.length,storm=state.chapter===2;
      const hidden=bridge&&!storm;
      const closed=(storm&&i===4)||(bridge&&storm&&!state.delivered.includes('lighthouse'));
      return {a,b,cost,hidden,closed,reason:storm&&i===4?'Closed by the storm':closed?'Deliver the lamp at Lighthouse to open this footbridge':''};
    });
  }
  function neighbours(at,state=start()) {
    return roadStates(state).filter(r=>!r.hidden&&!r.closed).flatMap(r=>r.a===at?[{to:r.b,cost:r.cost}]:r.b===at?[{to:r.a,cost:r.cost}]:[]);
  }
  function move(state,to) {
    if(state.phase!=='playing')return state;
    const road=neighbours(state.at,state).find(r=>r.to===to);
    if(!road||road.cost>state.minutes)return state;
    const c=chapter(state),minutes=state.minutes-road.cost,elapsed=c.budget-minutes;
    const job=c.jobs.find(j=>j.stop===to),fresh=job&&!state.delivered.includes(to);
    const onTime=job?.deadline===undefined||elapsed<=job.deadline;
    const delivered=fresh&&onTime?[...state.delivered,to]:[...state.delivered];
    const next={chapter:state.chapter,phase:'playing',at:to,minutes,delivered,history:[...state.history,{stop:to,cost:road.cost}],message:fresh&&onTime?job.story:to==='ferry'?'The ferry is here. Deliver all three parcels before boarding.':'The harbour clock ticks on. Which road next?',failure:null};
    const missed=c.jobs.find(j=>j.deadline!==undefined&&!delivered.includes(j.stop)&&elapsed>j.deadline);
    if(missed){next.phase='lost';next.failure='deadline';next.message='The garden gate has closed before its parcel arrived. Undo a road to try a different order, or restart this evening.';}
    else if(to==='ferry'&&delivered.length===c.jobs.length){next.phase='won';next.message=c.ending;}
    else if(!neighbours(to,next).some(r=>r.cost<=minutes)){next.phase='lost';next.failure='stranded';next.message='The ferry sounds its horn. No affordable road remains. Undo a road to revise your plan; nothing is running while you think.';}
    return next;
  }
  function undo(state){
    if(state.history.length<2)return state;
    let previous=start(state.chapter);
    for(const hop of state.history.slice(1,-1))previous=move(previous,hop.stop);
    return previous;
  }
  return Object.freeze({stops,roads,roadCatalog,chapters,chapter,create,start,roadStates,neighbours,move,undo});
});
