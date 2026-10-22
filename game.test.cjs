'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const game = require('./engine.js');

test('a complete delivery round wins with one minute left', () => {
  let s = game.start();
  for (const stop of ['garden', 'tower', 'market', 'lighthouse', 'ferry']) s=game.move(s,stop);
  assert.equal(s.phase,'won'); assert.equal(s.minutes,1);
  assert.deepEqual([...s.delivered].sort(),['garden','lighthouse','market']);
  assert.equal(s.at,'ferry'); assert.equal(s.history.length,6);
  assert.equal(game.move(s,'lighthouse'),s);
});
test('reaching the ferry early is not completion; a bad route misses it', () => {
  let s = game.start();
  for (const stop of ['market','tower','lighthouse','ferry']) s=game.move(s,stop);
  assert.equal(s.at,'ferry'); assert.equal(s.phase,'playing'); assert.equal(s.delivered.length,2);
  for (const stop of ['station','tower']) s=game.move(s,stop);
  assert.equal(s.phase,'lost'); assert.equal(s.minutes,1);
});
test('invalid travel does not spend time or change delivery state', () => {
  const ready=game.create(); assert.equal(game.move(ready,'market'),ready);
  const s=game.start(); assert.equal(game.move(s,'ferry'),s); assert.equal(game.move(s,'missing'),s);
  assert.equal(s.minutes,14); assert.deepEqual(s.delivered,[]);
});
test('returning to a delivered stop consumes time without duplicating parcels', () => {
  let s=game.start();for(const stop of ['market','tower','market'])s=game.move(s,stop);
  assert.equal(s.minutes,8); assert.deepEqual(s.delivered,['market']);
  const fresh=game.start();assert.equal(fresh.minutes,14);assert.deepEqual(fresh.delivered,[]);
});
test('the whole reachable round space has consistent time accounting and several winning routes', () => {
  const pending=[game.start()];let examined=0,won=0,lost=0;
  while(pending.length){const s=pending.pop();examined++;
    const cost=s.history.reduce((n,h)=>n+h.cost,0);assert.equal(s.minutes,14-cost);assert.ok(s.minutes>=0&&s.minutes<=14);
    assert.equal(new Set(s.delivered).size,s.delivered.length);
    if(s.phase==='won'){won++;assert.equal(s.at,'ferry');assert.equal(s.delivered.length,3);continue;}
    if(s.phase==='lost'){lost++;continue;}
    for(const {to,cost} of game.neighbours(s.at)){const next=game.move(s,to);if(cost<=s.minutes){assert.notEqual(next,s);pending.push(next);}else assert.equal(next,s);}
  }
  assert.ok(won>=3,'must offer more than one successful route');assert.ok(lost>0);assert.ok(examined>100);
  console.log(JSON.stringify({reachable_rounds:examined,winning_paths:won,failed_paths:lost}));
});
