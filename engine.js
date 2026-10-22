/* Last Ferry Courier — original game, MIT licence. Copyright 2026 brodyga45. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Courier = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const stops = Object.freeze({
    depot: { name: 'Depot', x: 95, y: 250, kind: 'depot' },
    market: { name: 'Market', x: 280, y: 130, kind: 'parcel', story: 'Warm bread for the market stall. The last customer gets dinner.' },
    garden: { name: 'Garden', x: 280, y: 380, kind: 'parcel', story: 'A letter for the gardener. She recognises the handwriting and smiles.' },
    tower: { name: 'Clock tower', x: 465, y: 250, kind: 'crossing' },
    lighthouse: { name: 'Lighthouse', x: 650, y: 105, kind: 'parcel', story: 'A new lamp for the keeper. A warm light returns to the bay.' },
    station: { name: 'Station', x: 650, y: 395, kind: 'crossing' },
    ferry: { name: 'Ferry', x: 825, y: 250, kind: 'finish' }
  });
  const roads = Object.freeze([
    ['depot', 'market', 2], ['depot', 'garden', 2],
    ['market', 'tower', 2], ['garden', 'tower', 2],
    ['market', 'lighthouse', 4], ['tower', 'lighthouse', 2],
    ['tower', 'station', 2], ['garden', 'station', 3],
    ['station', 'ferry', 2], ['lighthouse', 'ferry', 3], ['tower', 'ferry', 4]
  ].map(Object.freeze));
  const parcels = Object.keys(stops).filter(k => stops[k].kind === 'parcel');
  function create() {
    return { phase: 'ready', at: 'depot', minutes: 14, delivered: [], history: [{ stop: 'depot', cost: 0 }], message: 'Three parcels. One last ferry. Find your way through the harbour.' };
  }
  function start() { return { ...create(), phase: 'playing', message: 'Choose a road. The number on it is the travel time; thinking does not use time.' }; }
  function neighbours(at) {
    return roads.flatMap(([a, b, cost]) => a === at ? [{ to: b, cost }] : b === at ? [{ to: a, cost }] : []);
  }
  function move(state, to) {
    if (state.phase !== 'playing') return state;
    const road = neighbours(state.at).find(r => r.to === to);
    if (!road || road.cost > state.minutes) return state;
    const freshParcel = parcels.includes(to) && !state.delivered.includes(to);
    const delivered = freshParcel ? [...state.delivered, to] : [...state.delivered];
    const next = {
      phase: 'playing', at: to, minutes: state.minutes - road.cost, delivered,
      history: [...state.history, { stop: to, cost: road.cost }],
      message: freshParcel ? stops[to].story : to === 'ferry' ? 'The boat is here. Deliver all three parcels before boarding.' : 'The harbour clock ticks on. Which road next?'
    };
    if (to === 'ferry' && delivered.length === parcels.length) {
      next.phase = 'won';
      next.message = 'Bread on the table. A letter finally home. A light across the bay. The keeper waves as your ferry leaves.';
    } else if (!neighbours(to).some(r => r.cost <= next.minutes)) {
      next.phase = 'lost';
      next.message = 'The last ferry sounds its horn. There is no time left for another road. Take a look at your route, then try a different plan.';
    }
    return next;
  }
  return Object.freeze({ stops, roads, parcels: Object.freeze(parcels), create, start, neighbours, move });
});
