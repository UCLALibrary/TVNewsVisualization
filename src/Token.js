class Token {

    /**
     * Token: {
     *      ' CONTENT ': "white house", // in lowercase
     *      variant1: {
     *          doc1filename: # of mentions,
     *          doc2filename: # of mentions,
     *          ' SCORE ': 123
     *      },
     *      variant2: {
     *          doc3filename: # of mentions,
     *          doc4filename: # of mentions,
     *          ' SCORE ': 123
     *      },
     *      ...
     *      variant50: {
     *          doc99filename: # of mentions,
     *          doc100filename: # of mentions,
     *          ' SCORE ': 123
     *      },
     *      ' UNKNOWN ': {  // transcripts whose text is all uppercase
     *          doc101filename: # of mentions,
     *          doc102filename: # of mentions,
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

    addVariant( variant, srcFilename, mentions, isAllUpperCase ) {
        let originalVariant = variant;
        if ( isAllUpperCase ) {
            variant = ' UNKNOWN ';
        }
        if ( !( variant in this ) ) {
            this[variant] = {};
            this[variant][' SCORE '] = 0;
        }
        if ( srcFilename in this[variant] ) {
            console.log( `Token: WARN: Token.addVariant(variant=${originalVariant}, srcFilename=${srcFilename}):  srcFilename already exists. Ignored.` );
        } else {
            this[variant][srcFilename] = mentions;
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
            for ( let filename in this[option] ) {
                mentions += ( filename === ' SCORE ' ? 0 : this[option][filename] );
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
            console.log( `Token: WARN: Token.mergeFrom(other):  different ' CONTENT '. Ignored.` );
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
                for ( let filename in other[variant] ) {
                    if ( filename === ' SCORE ' ) {
                        this[variant][filename] += other[variant][filename];
                    } else {
                        if ( !( filename in this[variant] ) ) {
                            this[variant][filename] = 0;
                        }
                        this[variant][filename] += other[variant][filename];
                    }
                }
            }
        }

    }

}

module.exports = Token;