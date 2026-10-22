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
Play online: https://brodyga45.github.io/last-ferry-courier-20261022-shtops/

Serve this folder locally: python3 -m http.server 18871 --bind 127.0.0.1
Then open http://127.0.0.1:18871/ in your browser.
No build step, account, analytics, remote API or external assets are used.
Directly opening index.html with engine.js beside it should also work,
but direct file opening has not been verified in our browser environment.

CONTROLS
Choose a neighbouring stop on the map or use the named route buttons.
Keyboard: Tab through choices; Enter activates the focused choice.
On screens up to 480px wide, a compact portrait map shows all seven stops
without horizontal panning. Route buttons sit below the map. A retry
returns to the start; a win or loss brings its ending into view.
Sound is optional and starts muted; thinking never runs down the clock.

SOURCE AND CHECKS
  index.html       Interface, vector map, story and optional generated tones.
  engine.js        Dependency-free rules, also imported by the Node tests.
  game.test.cjs    Complete-round and exhaustive reachable-path checks.
  LICENSE          MIT licence for original code, text and vector artwork.
Run checks: node --test game.test.cjs

Author rules checks: five Node tests passed, including 1037 reachable states;
the engine is unchanged in the compact-map revision. Independent agent review
completed a 390px winning round and a 320px losing round, observed both
endings and retries, used Enter on a road button, and checked that a
390px-to-desktop-to-390px resize preserved the ongoing route. All seven
stops and eleven road prices were readable together at those narrow widths.
These are desktop-browser viewport checks, not human player research or
proof of buyer demand. Physical mobile hardware/touch, Safari, audible
output and screenreader conformance remain unverified.

Created for this project with AI assistance. No third-party raster assets,
client brief, customer artwork or previous professional game-client work
is implied. This is a self-directed open-source sample, not a client delivery.
