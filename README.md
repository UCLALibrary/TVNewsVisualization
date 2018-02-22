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

## Terms:
`token` = a keyword or a keyphrase

`mentions` = number of occurrence

`news` = number of transcripts containing the `token`

## TODO:

### SearchBox
- Bold the substring matched with the user typed word. Now the word in dropdown is only bold when the whole string matches.
- hide "more results" after all being shown

### Server
- Provide urls for the map to link to
- Make two stopword lists for keywords and keyphrases.
- If same score, sort by alphabetical order
- Speed becomes slow at the end when running on data of 2 months. Error message:
"allocation failure GC in old space requested". Extracting locations from 2 months data but key tokens only from 2011/01 takes 7'08'',
- Wow, that's funny. Those are consecutive recordings on the same channel, so perhaps they were initially one recording that was later split into 2. Still, I think it would be preferable to use the actual date_time_country_channel_network_show name as the unique ID for each recording, rather than the UID -- the former is more likely to be truly unique, apparently!

## Data change log

Add escapes (`"`=> `\"`) to the "Headlines" (usually line 8) in many .json files in ./data/

### From Slack
- alter the size of the square on the map based on the keyword's frequency in the time frame of a couple of days
- How to sort the tokens -- A combination of `news` and `mentions`. https://en.wikipedia.org/wiki/Tf%E2%80%93idf. Borrow some ideas from search-engine techniques like TF-IDF, like using the logarithm of the inverse fraction of the # of transcripts that contain the word as part of the weighting factor
- How to determine the upper/lower case -- Rather than majority vote, give much higher weight to the transcripts that have both uppercase and lowercase words. Also could apply fancier heuristics, e.g., look to see if a word is ever capitalized (first letter only) when it's NOT at the beginning of a sentence ("My name is Peter"); if so, use the capitalized version (Peter).
- Peter: ... NER (Named Entity Recognition) place tags in the .seg files.
My github repo here shows the code I used to geocode location names like “New York” to coordinates in bulk, using a local Gisgraphy server: https://github.com/RedHenLab/NewsSCOPE. We can just keep using it, or try a different service. Google’s accuracy is usually better, but maybe not enough to deal with the API fees we may incur. As I recall, the code is just the basic Stanford Named Entity Recognizer: https://nlp.stanford.edu/software/CRF-NER.html

### Note

A few json files in the sample transcript data didn’t add escapes before quotes when they are generated from txt files, so that when trying to parse the json object it reports an error. Most of the mistakes occur in the “Headlines” part of a transcript. I have corrected all these errors and I will include this change in the readme. It should be easy to avoid these in the future.