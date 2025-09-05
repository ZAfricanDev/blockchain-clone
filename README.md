# Stuarts Blockchain Explorer

## To start run

### `npm start`

## Design Decisions

When retrieving the latest set of blocks, the miner and bytes info is not available, a decision I took was to utilize local storage with a refresh time of 5 mins, to store all hash information, this front loads the network requests but after initial load makes the app instant.

BCH pricing would have required hitting another endpoint as both the VALR and Blockchain endpoints dont provide it so I opted not to.

I have added 2 header buttons, allowing the user to return to the main explorer screen and a button that will run a manual refresh for latest hashes

While not in the design brief, I included the input hex message for specific Hash's, if the mining pool information isn't mappable, you may be able to see it there.

API and general util functionality is stored in
`/src/api`

CSS is contained in `/src/css`

SVG icons are stored in `/src/assets/icons`

Pool information is stored in `/src/assets/pools/pools.ts`

In `src/index.tsx` React.StrictMode has been commented out so effect don't run twice
