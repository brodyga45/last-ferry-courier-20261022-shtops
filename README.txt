LAST FERRY COURIER
A short, original browser puzzle by brodyga45.

Deliver bread to the market, a letter to the garden and a lamp to the
lighthouse, then catch the ferry. You have 14 travel minutes. Thinking is
free; every road costs the time shown on the map. Try a route, discover
its consequences, and start another round if the ferry gets away.

This is one complete small experience, not an endlessly replayable game.
There are six winning routes, all costing 13 minutes. The map and story
stay the same on a new round.

PLAY
Serve this folder locally: python3 -m http.server 18871 --bind 127.0.0.1
Then open http://127.0.0.1:18871/ in your browser.
No build step, account, analytics, remote API or external assets are used.
Directly opening index.html with engine.js beside it should also work,
but direct file opening has not been verified in our browser environment.

CONTROLS
Choose a neighbouring stop on the map or use the named route buttons.
Keyboard: Tab through choices; Enter activates the focused choice.
On a narrow screen, swipe the map horizontally to see every stop. The
route buttons sit below the map. Whole-route planning is easier on desktop.
Sound is optional and starts muted; thinking never runs down the clock.

SOURCE AND CHECKS
  index.html       Interface, vector map, story and optional generated tones.
  engine.js        Dependency-free rules, also imported by the Node tests.
  game.test.cjs    Complete-round and exhaustive reachable-path checks.
  LICENSE          MIT licence for original code, text and vector artwork.
Run checks: node --test game.test.cjs

Author checks: five Node tests passed, including 1037 reachable states;
Chrome desktop win/loss/retry and keyboard win; emulated390px layout.
Independent agent review completed a first round from UI instructions,
then checked failure/retry and a390px viewport. This is not human player
research, proof of buyer demand, accessible conformance, real mobile
hardware/Safari coverage or verified audible output.

Created for this project with AI assistance. No third-party raster assets,
client brief, customer artwork or previous professional game-client work
is implied. This is a self-directed open-source sample, not a client delivery.
