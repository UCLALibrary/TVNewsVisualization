# TVNewsVisualization
This is the main repo for the BuildUCLA web team's project to build data visualizations around the NewsScape collection of digitized television news broadcasts.

## Install & Run

```
git clone https://github.com/UCLALibrary/TVNewsVisualization.git
cd TVNewsVisualization
npm install react-scripts
npm start
```

Server and client are concurrently running. Server running at localhost:3001, client running at localhost:3000

Go to browser : localhost:3000

## Stack

 
[Gisgraphy](http://www.gisgraphy.com/)

## TODO:

### SearchBox
- Bold the substring matched with the user typed word. Now the word in dropdown is only bold when the whole string matches.
- hide "more results" after all being shown

### Server
- Make two stopword lists for keywords and keyphrases.
- If same score, sort by alphabetical order
- Speed becomes slow at the end when running on data of 2 months. Error message:
"allocation failure GC in old space requested". Extracting locations from 2 months data but key tokens only from 2011/01 takes 7'08'',
- TokensExtractor: line 30 \r\n
- Code restructure and node modules removed from repo
- Write doc
- Page design
- gisgraphy (no results for "hawaii", need hardcode. What about query google first response
- enable hot recompile on server side
- make sure things are cached


## Data change log

Add escapes (`"`=> `\"`) to the "Headlines" (usually line 8) in many .json files in ./data/

### From Slack
- alter the size of the square on the map based on the keyword's frequency in the time frame of a couple of days
- How to sort the tokens -- A combination of `news` and `mentions`. https://en.wikipedia.org/wiki/Tf%E2%80%93idf. Borrow some ideas from search-engine techniques like TF-IDF, like using the logarithm of the inverse fraction of the # of transcripts that contain the word as part of the weighting factor
- How to determine the upper/lower case -- Rather than majority vote, give much higher weight to the transcripts that have both uppercase and lowercase words. Also could apply fancier heuristics, e.g., look to see if a word is ever capitalized (first letter only) when it's NOT at the beginning of a sentence ("My name is Peter"); if so, use the capitalized version (Peter).
- Peter: ... NER (Named Entity Recognition) place tags in the .seg files.
My github repo here shows the code I used to geocode location names like “New York” to coordinates in bulk, using a local Gisgraphy server: https://github.com/RedHenLab/NewsSCOPE. We can just keep using it, or try a different service. Google’s accuracy is usually better, but maybe not enough to deal with the API fees we may incur. As I recall, the code is just the basic Stanford Named Entity Recognizer: https://nlp.stanford.edu/software/CRF-NER.html
- keep in mind that one potentially useful refinement is being able to differentiate between references to point locations (cities and towns) vs. regions (states and countries) -- the latter show up a lot in the news, as you'd imagine.
It can be challenging to associate region references to actual polygons on the map, so one shortcut is just to resolve each region to a point on the map and use that.
- FYI the local geocoding service I used earlier is back up; the basic query format is `http://marinus.library.ucla.edu:8008/fulltext/fulltextsearch?format=json&allwordsrequired=true&spellchecking=false&from=1&to=1&q="new york"`

### Note

A few json files in the sample transcript data didn’t add escapes before quotes when they are generated from txt files, so that when trying to parse the json object it reports an error. Most of the mistakes occur in the “Headlines” part of a transcript. I have corrected all these errors and I will include this change in the readme. It should be easy to avoid these in the future.