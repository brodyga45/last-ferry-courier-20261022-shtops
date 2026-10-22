'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const game=require('./engine.js');
const walk=(chapter,path)=>path.reduce((s,to)=>game.move(s,to),game.start(chapter));

test('each evening has a complete authored route and a distinct planning constraint',()=>{
  const first=walk(0,['market','tower','garden','tower','lighthouse','ferry']);
  assert.equal(first.phase,'won');assert.equal(first.minutes,1);
  const late=walk(1,['market','tower','garden']);
  assert.equal(late.phase,'lost');assert.equal(late.failure,'deadline');assert.ok(!late.delivered.includes('garden'));
  const urgent=walk(1,['garden','tower','market','lighthouse','ferry']);
  assert.equal(urgent.phase,'won');assert.equal(urgent.minutes,1);
  const storm=walk(2,['market','tower','lighthouse','tower','garden','ferry']);
  assert.equal(storm.phase,'won');assert.equal(storm.minutes,1);assert.equal(storm.history.at(-1).cost,1);
});

test('a closed road cannot spend time; the light opens the final footbridge',()=>{
  const garden=walk(2,['garden']);assert.equal(game.move(garden,'ferry'),garden);
  const market=walk(2,['market']);assert.equal(game.move(market,'lighthouse'),market);
  const lit=walk(2,['market','tower','lighthouse','tower','garden']);
  assert.deepEqual(game.neighbours('garden',lit).find(r=>r.to==='ferry'),{to:'ferry',cost:1});
  assert.equal(game.move(lit,'ferry').phase,'won');
  const again=game.start(2);assert.ok(game.roadStates(again).find(r=>r.a==='garden'&&r.b==='ferry').closed);
});

test('undo restores cost, parcel, opened-road and failure state, without mutating the prior state',()=>{
  const base=walk(2,['market','tower']),snapshot=JSON.stringify(base),lamp=game.move(base,'lighthouse');
  assert.deepEqual(game.undo(lamp),base);assert.equal(JSON.stringify(base),snapshot);
  const failed=walk(1,['market','tower','garden']),undo=game.undo(failed);
  assert.equal(undo.phase,'playing');assert.equal(undo.at,'tower');assert.equal(undo.minutes,10);assert.deepEqual(undo.delivered,['market']);
  const won=walk(2,['market','tower','lighthouse','tower','garden','ferry']);
  assert.equal(game.undo(won).phase,'playing');assert.equal(game.undo(won).at,'garden');
  const start=game.start(0);assert.equal(game.undo(start),start);
});

test('rule metadata and shared roads are immutable; invalid evening is rejected',()=>{
  assert.throws(()=>game.start(3),RangeError);assert.throws(()=>game.start(-1),RangeError);
  assert.ok(Object.isFrozen(game.chapters));assert.ok(Object.isFrozen(game.chapters[1].jobs[1]));
  assert.ok(Object.isFrozen(game.stops.market));assert.ok(Object.isFrozen(game.roads[0]));
});

// Independent literal graph and transition oracle. It does not call engine.neighbours,
// engine.roadStates, or read engine chapter budgets/deadlines to derive expectations.
const edges=[['depot','market',2],['depot','garden',2],['market','tower',2],['garden','tower',2],['market','lighthouse',4],['tower','lighthouse',2],['tower','station',2],['garden','station',3],['station','ferry',2],['lighthouse','ferry',3],['tower','ferry',4]];
const destinations=['market','garden','lighthouse'];
const key=s=>JSON.stringify([s.at,s.minutes,[...s.delivered].sort(),s.phase]);
function refRoads(chapter,delivered){
  const result=edges.filter((_,i)=>chapter!==2||i!==4);
  return chapter===2&&delivered.includes('lighthouse')?[...result,['garden','ferry',1]]:result;
}
function referenceMove(s,to,chapter){
  if(s.phase!=='playing')return s;
  const edge=refRoads(chapter,s.delivered).find(([a,b])=>(a===s.at&&b===to)||(b===s.at&&a===to));
  if(!edge||edge[2]>s.minutes)return s;
  const minutes=s.minutes-edge[2],elapsed=(chapter===2?12:14)-minutes;
  const delivered=[...s.delivered];
  if(destinations.includes(to)&&!delivered.includes(to)&&!(chapter===1&&to==='garden'&&elapsed>4))delivered.push(to);
  let phase='playing';
  if(chapter===1&&elapsed>4&&!delivered.includes('garden'))phase='lost';
  else if(to==='ferry'&&delivered.length===3)phase='won';
  else if(!refRoads(chapter,delivered).some(([a,b,cost])=>(a===to||b===to)&&cost<=minutes))phase='lost';
  return {at:to,minutes,delivered,phase};
}
test('all three reachable state spaces match the independently specified route rules',()=>{
  const report=[];
  for(let chapter=0;chapter<3;chapter++){
    const q=[{actual:game.start(chapter),reference:{at:'depot',minutes:chapter===2?12:14,delivered:[],phase:'playing'}}],seen=new Set();let comparisons=0,wins=0;
    while(q.length){const {actual,reference}=q.shift(),k=key(actual);assert.equal(k,key(reference));if(seen.has(k))continue;seen.add(k);
      if(actual.phase==='won')wins++;
      for(const to of [...Object.keys(game.stops),'missing']){
        const a=game.move(actual,to),r=referenceMove(reference,to,chapter);assert.equal(key(a),key(r),`evening${chapter+1} ${k} -> ${to}`);comparisons++;
        assert.equal(a.minutes,(chapter===2?12:14)-a.history.reduce((n,h)=>n+h.cost,0));
        if(a!==actual)q.push({actual:a,reference:r});
      }
    }
    assert.ok(wins>0,'every evening must be solvable');report.push({evening:chapter+1,reachable_unique_states:seen.size,compared_moves:comparisons,winning_terminal_states:wins});
  }
  console.log(JSON.stringify({independent_campaign_audit:report}));
});
