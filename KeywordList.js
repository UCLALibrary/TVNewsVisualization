const fs = require('fs');
const readline = require('readline');
const csv = require("fast-csv");

class KeywordList {
    /**
     * 
     * @param {double} threshold The threshold for a word's frequency in
     * transcript over its frequency in freqWords.
     */
    constructor(threshold) {
        this.threshold = threshold;

        this.transcriptWordsSummary = {};
        this.transcriptUIDs = [];
        this.transcriptWordsCount = 0;
        this.freqWords = {};
        this.freqWordsCount = 0;

        this.keywords = [];
        this.uncoveredKeywords = [];    // words appear in transcript but not in freqWords.
    }

    _isAlphaNumeric(ch) {
        return ch.match(/^[a-z0-9]+$/i) !== null;
    }

    // Count occurrence of each word in the transcript
    // This method uses asynchronized read. The parameter
    // "callback" is a function to be called after the read ends.
    addTranscript(filePath, callback) {
        let duplicate = false;
        const readStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity
        });
        rl.on('line', line => {
            let lineObject = JSON.parse(line);
            if (!lineObject)
                return;
            if (lineObject.UID) {
                if (this.transcriptUIDs.includes(lineObject.UID)) {
                    duplicate = true;
                    rl.close();
                } else {
                    this.transcriptUIDs.push(lineObject.UID);
                }
            }
            if (duplicate || !(lineObject.Text))
                return;
            var words = lineObject.Text.split(' ');
            for (let index in words) {
                let word = words[index];
                // trim non-alphabet, non-digit characters from left and right
                let start = 0, end = word.length;
                while (start <= word.length && !this._isAlphaNumeric(word.charAt(start)))
                    start++;
                while (end > start && !this._isAlphaNumeric(word.charAt(end - 1)))
                    end--;
                word = (word.substring(start, end)).toLowerCase();
                if (word === "") return;
                if (word in this.transcriptWordsSummary) {
                    this.transcriptWordsSummary[word]++;
                } else {
                    this.transcriptWordsSummary[word] = 1;
                }
                this.transcriptWordsCount++;
            }
        }).on('close', () => {
            console.log(duplicate ?
                `Ignored duplicate transcript ${filePath}` :
                `Read transcript ${filePath} done`);
            // console.log(this.transcriptWordsSummary);
            readStream.destroy();
            callback();
        });
    }
    
    addTranscripts(filePathList, callback) {
        if (filePathList.length === 0) {
            callback();
        } else {
            this.addTranscript(filePathList[0], () => {
                this.addTranscripts(filePathList.slice(1, filePathList.length), callback);
            });
        }      
    }

	/**
     * Read the csv for 50k most frequent English words.
     * @param {string} filePath
     * @param {function} callback
     * @param {Boolean} existInTranscriptOnly If set to true, only store freqWords for 
     * the words that exist in transcript. Otherwise, load the full frequent words list.
     */
    readFreqWords(filePath, callback, existInTranscriptOnly) {
        let ignore = existInTranscriptOnly || true;
        csv
            .fromPath(filePath)
            .on("data", data => {
                if (ignore && !(data[0] in this.transcriptWordsSummary))
                    return;
                this.freqWords[data[0]] = parseInt(data[1]);
                this.freqWordsCount += parseInt(data[1]);
            })
            .on("end", () => {
                console.log(`Read freqWords ${filePath} done`);
                callback();
            });
    }

    build(callback) {
        let keywords = [], uncovered = [];

        for (let word in this.transcriptWordsSummary) {
            let count = this.transcriptWordsSummary[word];
            
            if (!(word in this.freqWords)) {
                uncovered.push({
                    word: word,
                    count: count
                });
            } else if (this._isKeyword(count, this.freqWords[word])) {
                keywords.push({
                    word: word,
                    count: count
                });
            }
        }

        this.keywords = keywords;
        this.uncoveredKeywords = uncovered;
        console.log("keywords : ",this.keywords);
        console.log("uncovered : ", this.uncoveredKeywords);
        console.log("Build keywords done");
        callback();
    }

    _isKeyword(occurrenceInTranscript, occurrenceInFreqWords) {
        return occurrenceInTranscript * 1.0 / this.transcriptWordsCount -
        occurrenceInFreqWords * 1.0 / this.freqWordsCount > this.threshold;
    }
}

module.exports = KeywordList;




