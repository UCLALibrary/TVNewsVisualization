const fs = require( 'fs' );
const Token = require( './Token' );

class TokenList {
    
    /**
     * The Structure:
     * 
     * TokenList: {
     *      keywords: {
     *          word1: {    // same as ' CONTENT '
     *              ' CONTENT ': "white house", // in lowercase
     *              variant1: {
     *                  doc1filename: # of mentions,
     *                  doc2filename: # of mentions,
     *                  ' SCORE ': 123
     *              },
     *              variant2: {
     *                  doc3filename: # of mentions,
     *                  doc4filename: # of mentions,
     *                  ' SCORE ': 123
     *              },
     *              ...
     *              variant50: {
     *                  doc99filename: # of mentions,
     *                  doc100filename: # of mentions,
     *                  ' SCORE ': 123
     *              },
     *              ' UNKNOWN ': {  // transcripts whose text is all uppercase 
     *                  doc101filename: # of mentions,
     *                  doc102filename: # of mentions,
     *                  ' SCORE ': 123
     *              },
     *              ' SCORE ': 123
     *          },  // the structure is implemented in the class Token
     *          word2: (Token) token,
     *          word3: (Token) token,
     *          ...
     *      },
     *      keyphrases: {
     *          phrase1: (Token) token,
     *          phrase2: (Token) token,
     *          phrase3: (Token) token
     *          ...
     *      }
     * }
     */
    constructor() {
        this.keywords = {};
        this.keyphrases = {};
    }

    addToken( variant, srcFilename, mentions, isAllUpperCase ) {
        let type = variant.includes( ' ' ) ? "keyphrases" : "keywords";
        let lowercase = variant.toLowerCase();
        if ( lowercase === "constructor" ) {
            variant = ' ' + variant + ' ';
            lowercase = ' ' + lowercase + ' ';
        }

        if ( !( lowercase in this[type] ) ) {
            this[type][lowercase] = new Token( lowercase );
        }
        this[type][lowercase].addVariant( variant, srcFilename, mentions, isAllUpperCase );
    }

    /**
     * Return type:
     * 
     * {
     *      keywords(sorted by score):  [
     *          {
     *              content: "trump",
     *              variant: "Trump",
     *              news: 10,
     *              mentions: 120,
     *              score: 123
     *          },
     *          ...
     *      ],
     *      keyphrases(sorted by score):  [
     *          {
     *              content: "white house",
     *              variant: "White House",
     *              news: 10,
     *              mentions: 120,
     *              score: 123
     *          },
     *          ...
     *      ]
     * }
     */
    exportBrief() {
        let keywords = [];
        for ( let word in this.keywords ) {
            keywords.push( this.keywords[word].exportBrief() );
        }
        keywords.sort( ( a, b ) => b.score - a.score );
        let keyphrases = [];
        for ( let phrase in this.keyphrases ) {
            keyphrases.push( this.keyphrases[phrase].exportBrief() );
        }
        keyphrases.sort( ( a, b ) => b.score - a.score );
        return {
            keywords: keywords,
            keyphrases: keyphrases
        }
    }

    mergeFrom( other ) {
        for ( let word in other.keywords ) {
            if ( !( word in this.keywords ) ) {
                this.keywords[word] = new Token( word );
            }
            try {
                this.keywords[word].mergeFrom( other.keywords[word] );
            } catch( error ) {
                let token = new Token( word );
                for ( let key in this.keywords[word] ) {
                    token[key] = this.keywords[word][key];
                }
                token.mergeFrom( other.keywords[word] );
                this.keywords[word] = token;
            }
        }
        for ( let phrase in other.keyphrases ) {
            if ( !( phrase in this.keyphrases ) ) {
                this.keyphrases[phrase] = new Token( phrase );
            }
            try {
                this.keyphrases[phrase].mergeFrom( other.keyphrases[phrase] );
            } catch( error ) {
                let token = new Token( phrase );
                for ( let key in this.keyphrases[phrase] ) {
                    token[key] = this.keyphrases[phrase][key];
                }
                token.mergeFrom( other.keyphrases[phrase] );
                this.keyphrases[phrase] = token;
            }
        }
    }

    mergeTo( keywordsDir, keyphrasesDir ) {
        // split this.keywords and this.keyphrases based on start letter
        let keywords = {}
        for ( let word in this.keywords ) {
            let letter = word.charAt( 0 );
            if ( !( letter in keywords ) ) {
                keywords[letter] = {};
            }
            keywords[letter][word] = this.keywords[word];
        }
        let keyphrases = {}
        for ( let phrase in this.keyphrases ) {
            let letter = phrase.charAt( 0 );
            if ( !( letter in keyphrases ) ) {
                keyphrases[letter] = {};
            }
            keyphrases[letter][phrase] = this.keyphrases[phrase];
        }

        // merge tokens based on start letter
        for ( let code = 'a'.charCodeAt( 0 ); code <= 'z'.charCodeAt( 0 ); code++ ) {
            let letter = String.fromCharCode( code );
            // keywords
            if ( letter in keywords ) {
                let file = keywordsDir + letter + '.json';
                let content = fs.readFileSync( file ).toString();
                let stored = new TokenList();
                if ( content === "" ) {
                    stored.keywords = keywords[letter];
                } else {
                    stored.keywords = JSON.parse( content );
                    let newTokens = new TokenList();
                    newTokens.keywords = keywords[letter];
                    stored.mergeFrom( newTokens );
                }

                fs.writeFileSync( file, JSON.stringify( stored.keywords ) )
            }
            // keyphrases
            if ( letter in keyphrases ) {
                let file = keyphrasesDir + letter + '.json';
                let content = fs.readFileSync( file ).toString();                
                let stored = new TokenList();
                if ( content === "" ) {
                    stored.keyphrases = keyphrases[letter];
                } else {
                    stored.keyphrases = JSON.parse( content );
                    let newTokens = new TokenList();
                    newTokens.keyphrases = keyphrases[letter];
                    stored.mergeFrom( newTokens )
                }

                fs.writeFileSync( file, JSON.stringify( stored.keyphrases ) )
            }
        }
    }

}

module.exports = TokenList;
