# TVNewsVisualization
This is the main repo for the BuildUCLA web team's project to build data visualizations around the NewsScape collection of digitized television news broadcasts.

##Install & Run

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
- Handle icon(s) onClick (circle, more space between)
- Bold the substring matched with the user typed word. Now the word in dropdown is only bold when the whole string matches.
- Simplify arguments of _getOptions
- hide "more results" after all being shown

### Server
- Make two stopword lists for keywords and keyphrases.
- If same score, sort by alphabetical order

### From Slack
- alter the size of the square on the map based on the keyword's frequency in the time frame of a couple of days
- How to sort the tokens -- A combination of `news` and `mentions`. https://en.wikipedia.org/wiki/Tf%E2%80%93idf. Borrow some ideas from search-engine techniques like TF-IDF, like using the logarithm of the inverse fraction of the # of transcripts that contain the word as part of the weighting factor
- How to determine the upper/lower case -- Rather than majority vote, give much higher weight to the transcripts that have both uppercase and lowercase words. Also could apply fancier heuristics, e.g., look to see if a word is ever capitalized (first letter only) when it's NOT at the beginning of a sentence ("My name is Peter"); if so, use the capitalized version (Peter).