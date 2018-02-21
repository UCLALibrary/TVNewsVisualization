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
     *                  doc1UID: # of mentions,
     *                  doc2UID: # of mentions,
     *                  ' SCORE ': 123
     *              },
     *              variant2: {
     *                  doc3UID: # of mentions,
     *                  doc4UID: # of mentions,
     *                  ' SCORE ': 123
     *              },
     *              ...
     *              variant50: {
     *                  doc99UID: # of mentions,
     *                  doc100UID: # of mentions,
     *                  ' SCORE ': 123
     *              },
     *              ' UNKNOWN ': {  // transcripts whose text is all uppercase 
     *                  doc101UID: # of mentions,
     *                  doc102UID: # of mentions,
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

    addToken( variant, srcNewsUid, mentions, isAllUpperCase ) {
        let type = variant.includes( ' ' ) ? "keyphrases" : "keywords";
        let lowercase = variant.toLowerCase();
        if ( lowercase === "constructor" ) {
            variant = ' ' + variant + ' ';
            lowercase = ' ' + lowercase + ' ';
        }

        if ( !( lowercase in this[type] ) ) {
            this[type][lowercase] = new Token( lowercase );
        }
        this[type][lowercase].addVariant( variant, srcNewsUid, mentions, isAllUpperCase );
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

    /**
     * 
     * @param {String} token 
     */
    getUIDsByToken( token ) {
        let type = token.includes( ' ' ) ? "keyphrases" : "keywords";
        let lowercase = token.toLowerCase();
        let UIDList = [];
        if ( !( lowercase in this[type] ) )
            return UIDList;
        for ( let variant in this[type][lowercase] ) {            
            if ( variant === ' CONTENT ' || variant === ' SCORE ' )
                continue;
            Object.keys( this[type][lowercase][variant] ).forEach( UID => {
                if ( UID !== ' SCORE ' )
                    UIDList.push( UID );
            }) 
        }
        return UIDList;
    }

    /**
     * 
     * @param {Array of String} tokens 
     */
    getUIDsByTokens( tokens ) {
        let UIDList = [];
        tokens.forEach( token => UIDList = UIDList.concat( this.getUIDsByToken( token ) ) );        
        return UIDList;
    }

    mergeFrom( other ) {
        for ( let word in other.keywords ) {
            if ( !( word in this.keywords ) ) {
                this.keywords[word] = new Token( word );
            }
            this.keywords[word].mergeFrom( other.keywords[word] );
        }
        for ( let phrase in other.keyphrases ) {
            if ( !( phrase in this.keyphrases ) ) {
                this.keyphrases[phrase] = new Token( phrase );
            }
            this.keyphrases[phrase].mergeFrom( other.keyphrases[phrase] );
        }
    }

}

module.exports = TokenList;
