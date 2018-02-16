class Token {

    /**
     * Token: {
     *      ' CONTENT ': "white house", // in lowercase
     *      variant1: {
     *          doc1UID: # of mentions
     *          doc2UID: # of mentions
     *          ' SCORE ': 123
     *      },
     *      variant2: {
     *          doc3UID: # of mentions
     *          doc4UID: # of mentions
     *          ' SCORE ': 123
     *      },
     *      ...
     *      variant50: {
     *          doc99UID: # of mentions
     *          doc100UID: # of mentions
     *          ' SCORE ': 123
     *      },
     *      ' UNKNOWN ': {  // transcripts whose text is all uppercase
     *          doc101UID: # of mentions
     *          doc102UID: # of mentions
     *          ' SCORE ': 123
     *      },
     *      ' SCORE ': 123
     * }
     */

    constructor( content ) {
        this[' CONTENT '] = content;
        this[' UNKNOWN '] = {};
        this[' UNKNOWN '][' SCORE '] = 0;
        this[' SCORE '] = 0;
    }

    addVariant( variant, srcNewsUid, mentions, isAllUpperCase ) {
        let originalVariant = variant;
        if ( isAllUpperCase ) {
            variant = ' UNKNOWN ';
        }
        if ( !( variant in this ) ) {
            this[variant] = {};
            this[variant][' SCORE '] = 0;
        }
        if ( srcNewsUid in this[variant] ) {
            console.log( `WARN:  Token.addVariant(variant=${originalVariant}, srcNewsUid=${srcNewsUid}):  srcNewsUid already exists. Ignored.` );
        } else {
            this[variant][srcNewsUid] = mentions;
            this[variant][' SCORE ']++;
            this[' SCORE ']++;
        }
    }

    /**
     * Return type:
     * 
     * {
     *      content: "trump",
     *      variant: "Trump",
     *      news: 10,
     *      mentions: 120,
     *      score: 123
     * }
     */
    exportBrief() {
        let variant = this[' CONTENT '], bestScore = 0, news = 0, mentions = 0;
        for ( let option in this ) {
            if ( option === ' CONTENT ' || option === ' SCORE ' ) {
                continue;
            }
            news += Object.keys( this[option] ).length - 1;
            for ( let UID in this[option] ) {
                mentions += ( UID === ' SCORE ' ? 0 : this[option][UID] );
            }
            if ( option !== ' UNKNOWN ' && this[option][' SCORE '] > bestScore ) {
                variant = option;
                bestScore = this[option][' SCORE '];
            }
        }

        return {
            content: this[' CONTENT '],
            variant: variant,
            news: news,
            mentions: mentions,
            score: this[' SCORE ']
        }
    }

    mergeFrom( other ) {
        if ( this[' CONTENT '] !== other[' CONTENT '] ) {
            console.log( `WARN:  Token.mergeFrom(other):  different ' CONTENT '. Ignored.` );
        } else {
            for ( let variant in other ) {
                if ( variant === ' CONTENT ') {
                    continue;
                }
                if ( variant === ' SCORE ' ) {
                    this[variant] += other[variant];
                }
                if ( !( variant in this ) ) {
                    this[variant] = {};
                    this[variant][' SCORE '] = 0;
                }
                for ( let UID in other[variant] ) {
                    if ( UID === ' SCORE ' ) {
                        this[variant][UID] += other[variant][UID];
                    } else {
                        if ( !( UID in this[variant] ) ) {
                            this[variant][UID] = 0;
                        }
                        this[variant][UID] += other[variant][UID];
                    }
                }
            }
        }

    }

}

module.exports = Token;