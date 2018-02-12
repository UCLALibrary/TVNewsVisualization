# TVNewsVisualization
This is the main repo for the BuildUCLA web team's project to build data visualizations around the NewsScape collection of digitized television news broadcasts.

##Run

```
git clone https://github.com/UCLALibrary/TVNewsVisualization.git
cd TVNewsVisualization
npm start
```

Server and client are concurrently running. Server running at localhost:3001, client running at localhost:3000

Go to browser : localhost:3000

`data/freqWords_2016_en_50k.csv` source : https://github.com/hermitdave/FrequencyWords
The source repo also has the full dictionary containing around 1000k words, but if a word that is not the most frequent 50k words occurs in the transcript, we consider it a keyword.

To extract words from a sentence, we split the string by space(" ") and trim all characters except alpha and digits from left and right. So a string

"Hey"   it's you!!

is splitted to ["Hey", "it's", "you"]

##TODO:
###SearchBox
- Use Select (antd) to support multiple keywords
- Handle icon onClick
- Bold the substring matched with the user typed word. Now the word in dropdown is only bold when the whole string matches.
###Server
- Currently after a transcript is found duplicate, the fileStream still reads from the file though words are not counted. Destroying readStream on "close" event won't help.
- Consider substitution for callback, like `.on`, `.then`, `promise`.
- Make a trivialWords checklist, remove those words from keywords.
###Special Cases for isKeyword
- typo
- plural
- weren't don’t
- 27-year-old baby-sit
- 11:00 a.m.
- Person's name (e.g. Charlie Sheen, can we recognize as a group?)
- $8,000 (as in ./data/test/transcript.json)
