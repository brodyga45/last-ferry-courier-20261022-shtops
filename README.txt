LAST FERRY COURIER — THREE EVENINGS
A turn-based route-planning story by brodyga45.
Author-ready candidate for independent review; this folder is not proof of a public release.

A small harbour changes over three evenings. First learn its road costs and
keep three delivery promises. Next, plan around an early closing gate.
Finally, a storm closes a road and a delivered lamp opens a new way home.
Each evening finishes at the ferry; the third has a closing story.
This is a finite journey, not an endless or randomly generated game.

PLAY
Serve this folder locally: python3 -m http.server 18871 --bind 127.0.0.1
Open http://127.0.0.1:18871/?autostart=1 for an immediately active board.
Without that parameter the standalone introduction is retained.
No build, account, remote API, analytics, network asset or paid dependency.

HOW IT WORKS
Roads spend travel minutes. Thinking never spends time.
Visit tonight's three delivery destinations, then finish at Ferry.
The second evening's Garden delivery is due by travel minute 4.
The last evening has a 12-minute budget, a storm-closed Market-Lighthouse
road, and a Garden-Ferry footbridge opened by the Lighthouse delivery.
All changed conditions are described before movement.

Undo road restores the previous position, time and deliveries, including
a failed route. Restart evening resets only the current evening. Completing
an evening unlocks the next; completed evenings can be replayed from the tabs.
The local browser saves completed evenings and the selected evening when
storage is available. An unfinished route restarts on reload. If storage
fails, the game still works in the current tab. There is no server account.

Use the map or named road buttons. Tab and Enter work; Space activates a
focused map stop. Optional synthesized sound is off initially. Initial
entry and restarting preserve explicit ?autostart=1 without a synthetic click.
The narrow map avoids horizontal panning; ordinary vertical scrolling may
be needed for notes and named route buttons.

SOURCE AND AUTHOR CHECKS
  index.html          Interface, original vector map, progression and tones.
  engine.js           Immutable evening rules and pure move/undo functions.
  game.test.cjs       First-evening original complete-path regression checks.
  campaign.test.cjs   Deadlines, bridge, undo and independent transition audit.
  LICENSE             MIT license.
Run: node --test game.test.cjs campaign.test.cjs

10 tests passed. The original evening retains its 1,037 explored path states
and six winning walks. Independent literal-rule comparison covers 137, 101
and 94 unique states in the three evenings, with 2,656 attempted moves.
Unique terminal states are not counts of different winning walks.

Author Chrome UI observations: complete progression through all three
endings; missed deadline and Undo; lamp opens the bridge; final epilogue;
completed evenings survive reload; explicit/default launch modes; 390px
same-origin frame first move, Undo, keyboard Enter, deadline visibility and
restart. Copy, labels and compact notes were refined during this pass.
These are author checks, not independent interest or acceptance findings.
The narrow frame is not a physical phone. Safari, physical touch, audible
output and screenreader conformance remain unverified. There is no measured
human engagement, willingness to pay or paid customer delivery.

Original code, story and vector artwork were developed with AI assistance.
No client assets or claimed professional game-client history are included.
