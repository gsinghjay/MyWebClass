# CHANGELOG


## v1.5.0-rc.1 (2025-12-18)

### Bug Fixes

- Add url filter to articleCard links for proper pathPrefix
  ([`021fd62`](https://github.com/gsinghjay/MyWebClass/commit/021fd6263d3f08ab792076e68e850408b37fc954))

- Await Discord notification to prevent Lambda termination
  ([`9147751`](https://github.com/gsinghjay/MyWebClass/commit/9147751a198b1ce1da5ebdb10240c39e0bdeef7f))

- Improve gallery card consistency and community submissions display
  ([`05d4407`](https://github.com/gsinghjay/MyWebClass/commit/05d44078d669ab37aa54704e680c2d467f75e975))

- Update E2E tests for gallery move to /styles/ page
  ([`fdf1562`](https://github.com/gsinghjay/MyWebClass/commit/fdf15622c50cfa83b3cbc3f88f82896f5d5e9a60))

- Update hero CTA to link to community gallery section
  ([`4269595`](https://github.com/gsinghjay/MyWebClass/commit/426959504469835a430559e975cc21c567693d35))

- **ci**: Ensure Sanity env vars available for Playwright tests
  ([`2daf242`](https://github.com/gsinghjay/MyWebClass/commit/2daf242cc908a95937c9cb5a245ff54a749cb81b))

- **ci**: Run full build before E2E tests
  ([`0e8e578`](https://github.com/gsinghjay/MyWebClass/commit/0e8e578ef5bc28b7c46dce7560bb5474ec8c92ba))

- **ci**: Use DEPLOY_PATH_PREFIX instead of GITHUB_ACTIONS for pathPrefix
  ([`2c5d611`](https://github.com/gsinghjay/MyWebClass/commit/2c5d611a5939685b520b6977d4987c35fe705d86))

- **ci**: Use http-server for Playwright in CI
  ([`83ea14c`](https://github.com/gsinghjay/MyWebClass/commit/83ea14c8dfdd356ee6426989d69b6a6e0023533a))

- **images**: Resolve Sanity CDN URLs not rendering in Nunjucks macros
  ([`84d3543`](https://github.com/gsinghjay/MyWebClass/commit/84d35439a1f604e45c4affda9d1af5726d4ad482))

- **netlify**: Add npm ci to build command
  ([`a22830f`](https://github.com/gsinghjay/MyWebClass/commit/a22830f40098e92f474ac750261df67ca65c5bc0))

- **netlify**: Add SECRETS_SCAN_OMIT_PATHS for _bmad and docs folders
  ([`94b2ed3`](https://github.com/gsinghjay/MyWebClass/commit/94b2ed354108e1c47b8554e9427579b5d473386c))

- **netlify**: Disable secret scanning (false positives)
  ([`ff1c48a`](https://github.com/gsinghjay/MyWebClass/commit/ff1c48a8e850a4b9dd548adb392dff574970d39d))

- **netlify**: Disable secret scanning entirely (public Sanity values cause false positives)
  ([`2c1efe6`](https://github.com/gsinghjay/MyWebClass/commit/2c1efe6751e8998211c69fe86b44c1714b040147))

- **netlify**: Remove 'production' string to avoid false positive secret detection
  ([`5c70d3e`](https://github.com/gsinghjay/MyWebClass/commit/5c70d3e4c57f785f85fe78579cd4906700c6633b))

- **netlify**: Run build commands directly, remove NODE_ENV from env
  ([`86a75aa`](https://github.com/gsinghjay/MyWebClass/commit/86a75aa90cc8c03227bc31709172423b52090397))

- **netlify**: Run build steps directly and include devDependencies
  ([`8f22250`](https://github.com/gsinghjay/MyWebClass/commit/8f22250eaad325686e91c2899af14fbe1029aa1d))

- **tests**: Add networkidle waits for CI test stability
  ([`a453328`](https://github.com/gsinghjay/MyWebClass/commit/a4533284687a4174cd7cca2f1ad751c0526ed5c1))

- **tests**: Inline viewport setup in each test for CI reliability
  ([`4e462e2`](https://github.com/gsinghjay/MyWebClass/commit/4e462e2dc0cb2b2e915c10aba2246c4191395e7e))

- **tests**: Use beforeEach for viewport setup in CI
  ([`ab5c595`](https://github.com/gsinghjay/MyWebClass/commit/ab5c5951192ac5a239adefeb8d9b74d941c77b78))

### Chores

- Add Story 4.5 file and validation report
  ([`9019744`](https://github.com/gsinghjay/MyWebClass/commit/9019744e360a915a3d302791f9d5fac8abbb367f))

- Bmad update
  ([`bc198df`](https://github.com/gsinghjay/MyWebClass/commit/bc198df5e3be708c7893619742428eba84fd4ffb))

- BMAD update
  ([`1a1adce`](https://github.com/gsinghjay/MyWebClass/commit/1a1adce4045d0eecfa4f32670fe34e05e03cde72))

- Mark story 2.6 as done
  ([`f3b3818`](https://github.com/gsinghjay/MyWebClass/commit/f3b381830bca90a0b39ae678038f07e5c22aa725))

- Mark Story 4.6 as done
  ([`315984f`](https://github.com/gsinghjay/MyWebClass/commit/315984f16725e1409c57a7cf9842cbb445b9c4f4))

- Story file
  ([`4abcba0`](https://github.com/gsinghjay/MyWebClass/commit/4abcba0011723cf141319c6cc3b2def9bbcc7f8e))

- Story files
  ([`7c4af50`](https://github.com/gsinghjay/MyWebClass/commit/7c4af50ec204f5a76dc6a39e1b0e515e1a875a6d))

- Switch from GitHub Pages to Netlify hosting
  ([`e65fb76`](https://github.com/gsinghjay/MyWebClass/commit/e65fb76311997e0f38740d4a998920846292c44e))

- Update sprint status with completed stories and site improvements
  ([`4b5aa42`](https://github.com/gsinghjay/MyWebClass/commit/4b5aa425a8377527e212c9b645bd95b61cdee78d))

- Update to project artifacts
  ([`bbce29e`](https://github.com/gsinghjay/MyWebClass/commit/bbce29ec1836c5a0c2f58368c1c89752b1b8f101))

### Documentation

- Clarify Netlify hosting and serverless function architecture
  ([`4c14057`](https://github.com/gsinghjay/MyWebClass/commit/4c140575ce054fa95ea28b00b958b8199fa10379))

- Update development guide and project context for Netlify
  ([`8df9d2f`](https://github.com/gsinghjay/MyWebClass/commit/8df9d2fce0a1e90b0213fefeeb1da755a76ac7ed))

- Update README with Netlify badge, live URL, and deployment info
  ([`ead63f8`](https://github.com/gsinghjay/MyWebClass/commit/ead63f844245971a96e262a57b78ebf4a409f3e0))

### Features

- Make style badge clickable on submission cards
  ([`a3133b1`](https://github.com/gsinghjay/MyWebClass/commit/a3133b146091cae082e1ef5b439c5f3cb9711465))

- Move Design Style Gallery to dedicated /styles/ page
  ([`9e50de4`](https://github.com/gsinghjay/MyWebClass/commit/9e50de4e7d8adf494fdf34de851e35c3a47d2360))

- **articles**: Implement educational articles display (Story 2.7)
  ([`1053916`](https://github.com/gsinghjay/MyWebClass/commit/105391624a0e25dde27aa27c15494f4e1660b3e2))

- **discord**: Story 4.6 - Discord webhook shows human-readable style name
  ([`b3611f1`](https://github.com/gsinghjay/MyWebClass/commit/b3611f18bac1b37b34f6dfb766ea8329e6983b37))

- **gallery**: Add Community Gallery section for approved submissions
  ([`792e405`](https://github.com/gsinghjay/MyWebClass/commit/792e40559aef318f029190601ad5c155afdfb0b8))

- **privacy**: Story 3.1 - Cookie Consent Banner with GA4 Consent Mode
  ([`3f58972`](https://github.com/gsinghjay/MyWebClass/commit/3f589728411c045defa3c3c9674ba7470f61a83b))

- **privacy**: Story 3.2 - Cookie Preferences Management
  ([`45515f8`](https://github.com/gsinghjay/MyWebClass/commit/45515f8012c1d929be2d4e8b564a8dd3be197226))

- **responsive**: Implement mobile-first responsive experience
  ([`88684f8`](https://github.com/gsinghjay/MyWebClass/commit/88684f86f61167da3e91b21462876ecdba6901b7))

- **submission**: Story 4.1 - Submission Form Page with validation
  ([`209eb93`](https://github.com/gsinghjay/MyWebClass/commit/209eb932bd6f55fa36e9fb304ace8461f7e7986f))

- **submission**: Story 4.2 - Consent Checkboxes with GDPR compliance
  ([`4b7448e`](https://github.com/gsinghjay/MyWebClass/commit/4b7448e1cf41b99e4a4c40ada510d60982da6dcf))

- **submission**: Story 4.3 - Screenshot Upload with Preview
  ([`9c7e50d`](https://github.com/gsinghjay/MyWebClass/commit/9c7e50da67bc115c646d709b2f7708692bb4424b))

- **submission**: Story 4.4 - Form Submission Handler
  ([`5116f65`](https://github.com/gsinghjay/MyWebClass/commit/5116f653f3f717ddb573f1bb1674a5d804cfe1a3))

### Refactoring

- Remove redundant admin page and simplify navigation
  ([`886543f`](https://github.com/gsinghjay/MyWebClass/commit/886543fdbac9f82c47132821276631b921614c9c))


## v1.4.0 (2025-12-08)

### Features

- **gallery**: Add Featured Themes section with curated submissions
  ([`9b336a8`](https://github.com/gsinghjay/MyWebClass/commit/9b336a805747b8471f0915d4bf29af0c7bf71b0b))


## v1.3.0 (2025-12-08)

### Bug Fixes

- **test**: Use chromium only for Playwright tests
  ([`476251c`](https://github.com/gsinghjay/MyWebClass/commit/476251c939f27ed155a7d876bb1524a1546f9119))

### Documentation

- Mark story 2-2 as done
  ([`5a41c70`](https://github.com/gsinghjay/MyWebClass/commit/5a41c70ca5aa734ebe53d2ba392924b89dd27f0d))

- Update README with testing info and add Playwright to gitignore
  ([`8533a51`](https://github.com/gsinghjay/MyWebClass/commit/8533a516e184dbd5dd461a0454a22deb08ab866a))

### Features

- **gallery**: Implement category filtering with 7 design categories
  ([`abf5169`](https://github.com/gsinghjay/MyWebClass/commit/abf5169f1f0349a8ea7681eab87c26a88a36812d))

### Testing

- **e2e**: Add Playwright tests for gallery filtering
  ([`8beb5f3`](https://github.com/gsinghjay/MyWebClass/commit/8beb5f3db1d2c95389c29d226306e8372b0d0320))


## v1.2.0 (2025-12-08)

### Features

- **detail**: Implement style detail pages with hero, gallery, and educational content
  ([`5c95fc1`](https://github.com/gsinghjay/MyWebClass/commit/5c95fc1875504719b92c8c6ab8408ea6cde12503))


## v1.1.0 (2025-12-08)

### Features

- **gallery**: Implement design style cards with Sanity CDN images
  ([`3e4fae2`](https://github.com/gsinghjay/MyWebClass/commit/3e4fae20cccc7e4f36d4e14992216559b59737a5))


## v1.0.2 (2025-12-08)

### Bug Fixes

- **ci**: Set changelog mode to init for full history generation
  ([`a01b988`](https://github.com/gsinghjay/MyWebClass/commit/a01b988e20737acb5cd28c6d2ce2687c181a9d59))


## v1.0.1 (2025-12-08)

### Bug Fixes

- **ci**: Enable changelog commit and push in semantic release
  ([`90f0a34`](https://github.com/gsinghjay/MyWebClass/commit/90f0a345c3169e798ade059842e4cef0661d2829))


## v1.0.0 (2025-12-08)

- Initial Release
