# TVNewsVisualization

This is the main repo for the BuildUCLA web team's project to build data visualizations around the NewsScape collection of digitized television news broadcasts.

## Install & Run

- Clone the repository
```
git clone https://github.com/UCLALibrary/TVNewsVisualization.git
cd TVNewsVisualization
```

- Install npm and node

- Install node modules for the server
```
npm install
```

- Install node modules for the client
```
cd client/ && npm install && cd ..
```

- Concurrently run the server (at localhost:3001) and the client (at localhost:3000)
```
npm start
```

- Go to browser, localhost:3000

You can also run server only (`npm run server`) or run client only (`npm run client`). See ./package.json for more details. For now, when client side code is changed and saved, the running client recompiles automatically, but manually recompiling is required after server side code is modified.

## Stack

- Front-end: [ReactJS](https://reactjs.org), [Ant Design](https://ant.design)
- Back-end: [NodeJS](https://nodejs.org/en/), [retext-keywords](https://github.com/retextjs/retext-keywords), [Gisgraphy](http://www.gisgraphy.com/)

## File Structure

Source code for client is in ./client/src. Source code for server, except ./server.js, is in ./src.
```
├── client
│   ├── public
│   │   ├── index.html          # html web page
│   │   └── ...
│   ├── src                     # source code for client
│   │   ├── App.jsx
│   │   ├── Client.js
│   │   ├── index.js
│   │   ├── SearchBox.jsx
│   │   ├── SearchResults.jsx
│   │   ├── MapContainer.jsx
│   │   └── ...
│   └── ...
├── data
├── src                         # source code for server
│   ├── MapInfoExtractor.js     # extract information for the map from .seg transcripts
│   ├── Stoplist.js             # lists of stop words and phrases, to improve token extraction
│   ├── TokenExtractor.js       # extract tokens from .json transcripts.
│   └── ...
└── server.js                   # main code for the server
```

## TODO:

### Map
- Use react-google-maps instead of google-maps-react !!! which is better and supports marker clusters. See ReactMap.js for (unused) Calvin's code. If google-maps-react is not used anymore, it's safe to remove GoogleApi.js, GoogleApiComponent.js, and ScriptCache.js.
- Link inside infowindow not clickable

### SearchBox
- Bold the substring matched with the user typed word. Now the word in dropdown is only bold when the whole string matches.
- hide "more results" after all being shown
- Page design (nav, footer, etc)
- Try scss

### Server
- Make two stopword lists for keywords and keyphrases.
- If same score, sort by alphabetical order
- What to do if no location in a transcript? Currently ignored.
- File I/O in TokenExtractor can be refined.

### From Slack
- alter the size of the square on the map based on the keyword's frequency in the time frame of a couple of days
- How to sort the tokens -- A combination of `news` and `mentions`. https://en.wikipedia.org/wiki/Tf%E2%80%93idf. Borrow some ideas from search-engine techniques like TF-IDF, like using the logarithm of the inverse fraction of the # of transcripts that contain the word as part of the weighting factor
- How to determine the upper/lower case -- Rather than majority vote, give much higher weight to the transcripts that have both uppercase and lowercase words. Also could apply fancier heuristics, e.g., look to see if a word is ever capitalized (first letter only) when it's NOT at the beginning of a sentence ("My name is Peter"); if so, use the capitalized version (Peter).
- One potentially useful refinement is being able to differentiate between references to point locations (cities and towns) vs. regions (states and countries) -- the latter show up a lot in the news, as you'd imagine.
It can be challenging to associate region references to actual polygons on the map, so one shortcut is just to resolve each region to a point on the map and use that.

### Note

A few json files in the sample transcript data didn’t add escapes before quotes when they are generated from txt files, so that when trying to parse the json object it reports an error. Most of the mistakes occur in the “Headlines” part of a transcript. It should be easy to avoid these in the future.

All .json files in ./data/ have been corrected.