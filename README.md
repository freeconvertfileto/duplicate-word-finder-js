# Duplicate Word Finder

Find repeated words in text with frequency counts, word positions, and an optional common-word filter, entirely in the browser.

**Live Demo:** https://file-converter-free.com/en/text-tools/duplicate-word-finder-online

## How It Works

The input text is matched against `/[a-zA-Z\u00C0-\u024F]+(?:'[a-zA-Z]+)?/g` to extract words including extended Latin characters and contractions. Each match is normalized to lowercase for the deduplication key (or kept as-is if case-sensitive mode is enabled). A `wordMap` object tracks occurrence counts and a `positions` object tracks the sequential word number of each occurrence. If "ignore common words" is enabled, words found in a 57-entry `COMMON_WORDS` lookup object (articles, prepositions, pronouns, auxiliaries) are skipped. Words appearing more than once are collected into a `duplicates` array, sorted descending by count, and rendered as result cards showing the word, occurrence count (`x N`), and up to 10 position numbers.

## Features

- Extended Latin character support (U+00C0–U+024F) for accented letters
- Contraction support (e.g., "don't" counted as one word)
- Optional case-sensitive mode
- Optional common-word filter (57 entries: articles, prepositions, pronouns, auxiliaries)
- Results sorted by frequency (most repeated first)
- Up to 10 position numbers shown per word

## Browser APIs Used

- (No external APIs — pure DOM and regex)

## Code Structure

| File | Description |
|------|-------------|
| `duplicate-word-finder.js` | IIFE — regex word tokenizer with extended Latin, COMMON_WORDS filter, frequency map + position tracking, frequency-sorted result cards |

## Usage

| Element ID | Purpose |
|------------|---------|
| `dupwordInput` | Input text textarea |
| `dupwordFind` | Run analysis |
| `dupwordClear` | Clear input and results |
| `dupwordStatus` | Status message (found count) |
| `dupwordResults` | Results panel |
| `dupwordList` | Container for result cards |
| `dupwordCaseSensitive` | Case-sensitive mode checkbox |
| `dupwordIgnoreCommon` | Ignore common words checkbox |

## License

MIT
