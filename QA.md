# Verification record

## Executed in the cloud environment

- Node.js 24.19.0, Python 3.12.14; dependency-free production build.
- `npm test`: five test groups passed. Validates all 368 question records and 163 source entries, unique choices and IDs, Chinese sentence vocabulary coverage, 100 randomized rounds, all practice difficulties, 400 lifeline combinations and both guaranteed milestones.
- Chromium via Playwright: completed a full 15-question winning game, checked the million result and confetti; completed five correct answers then failed and verified 1 000 zł guarantee; tested all three single-use lifelines, answer mapping after shuffling, replay reset, teacher reveal and continuation, chosen classroom difficulty, paused timer, timer reset, timeout and zero result, restart confirmation.
- Checked desktop 1440px and mobile 390px layouts, with no horizontal overflow. Screenshots inspected for start and gameplay screens. No JavaScript page errors during the tested flows.
- `npm run build`: generated standalone static files in `dist/`.

## Content review

The 12 PDF page images were read to transcribe all 163 entries. Chinese characters, tones and Polish meanings were compared against those images. Pinyin follows the handbook, including its varying spacing and neutral-tone conventions. Contextual questions use only source vocabulary; examples in the user brief containing unlisted words were not imported. Automated segmentation verifies Chinese prompts and correct contextual answers against the source entries. Distractors for vocabulary exclude duplicate translations, overlapping senses and selected synonyms. Question accuracy still benefits from normal teacher editorial review; no independent external language certification is claimed.

## Limits

Safari/WebKit and Microsoft Edge were not executed. WebKit's Playwright binary is not installed; downloading browser binaries met a network domain restriction. Chromium is available as a system browser and all reported browser tests used it. Production hosting and HTTPS accessibility must be verified after deployment; local HTTP validation does not establish public deployment.

## Rerun browser checks

With the app served on port 8000, point `PLAYWRIGHT_MODULE` to an installed Playwright module, and optionally `CHROMIUM_PATH` to a Chromium binary. Run `node tests/browser.cjs`. Set `TEST_WEBKIT=1` to additionally require the WebKit smoke check when that browser is installed. The browser test writes screenshots under `/tmp/`, never into source directories.
