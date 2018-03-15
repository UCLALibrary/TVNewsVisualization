const fs = require( 'fs' );
const retext = require( 'retext' );
const retext_keywords = require( 'retext-keywords' );
const nlcstToString = require( 'nlcst-to-string' );
const log = require( 'single-line-log' ).stdout;

const Token = require( './Token' );
const TokenList = require( './TokenList' );
const Stoplist = require( './Stoplist.js' );

/**
 * Extract tokens from .json transcripts.
 */
class TokensExtractor {

	constructor( resetDir ) {
		this.reset( resetDir );
	}

	exportBrief() {
		// keywords
		let keywords = [];
        for ( let code = 'a'.charCodeAt( 0 ); code <= 'z'.charCodeAt( 0 ); code++ ) {
            let letter = String.fromCharCode( code );
			let file = this.keywordsDir + letter + '.json';
			let keywordsMap = fs.readFileSync( file ).toString();
			keywordsMap = ( keywordsMap === "" ) ? {} : JSON.parse( keywordsMap );
			for ( let word in keywordsMap ) {
				let brief = null;
				try {
					brief = keywordsMap[word].exportBrief()
				} catch( error ) {
					let token = new Token( word );
					for ( let key in keywordsMap[word] ) {
						token[key] = keywordsMap[word][key];
					}
					brief = token.exportBrief()
				}
				keywords.push( brief );
			}
		}
		keywords.sort( ( a, b ) => b.score - a.score );
		// keyphrases
        let keyphrases = [];
        for ( let code = 'a'.charCodeAt( 0 ); code <= 'z'.charCodeAt( 0 ); code++ ) {
            let letter = String.fromCharCode( code );
			let file = this.keyphrasesDir + letter + '.json';
			let keyphrasesMap = fs.readFileSync( file ).toString();
			keyphrasesMap = ( keyphrasesMap === "" ) ? {} : JSON.parse( keyphrasesMap );
			for ( let phrase in keyphrasesMap ) {
				let brief = null;
				try {
					brief = keyphrasesMap[phrase].exportBrief()
				} catch( error ) {
					let token = new Token( phrase );
					for ( let key in keyphrasesMap[phrase] ) {
						token[key] = keyphrasesMap[phrase][key];
					}
					brief = token.exportBrief()
				}
				keyphrases.push( brief );
			}
		}
        keyphrases.sort( ( a, b ) => b.score - a.score );
        return {
            keywords: keywords,
            keyphrases: keyphrases
		}
	}

	extract( filePath ) {
		let contents = fs.readFileSync( filePath ).toString();
		contents = contents.replace(/\r\n/, '\n');

		let startpos = 0, jsonStart = 0, jsonEnd = 0;
		let filename = '', text = '';

		while ( true ) {
			jsonStart = contents.indexOf( '{', startpos );
			if (jsonStart < 0) break;
			jsonEnd = contents.indexOf( '}\n', startpos );
			let fileLine = JSON.parse( contents.substring( jsonStart, jsonEnd + 1 ) );

			if ( fileLine.Filename ) {
				if ( this.transcriptFilenames.includes( fileLine.Filename ) ) {
					return null;
				} else {
					filename = fileLine.Filename;
					this.transcriptFilenames.push( filename );
				}
			}
			if ( fileLine.Text ) text += fileLine.Text + ' ';

			startpos = jsonEnd + 1;
		}
		// remove extra spaces
		text = text.replace( /\s+/g, ' ' ).trim();
		// If we also lowercase text here, the result will be different even ignoring the case.
		let upperCount = 0, lowerCount = 0;
		for ( let i = 0; i < text.length; i++ ) {
			if ( text[i] >= 'A' && text[i] <= 'Z' ) {
				upperCount++;
			} else if ( text[i] >= 'a' && text[i] <= 'z' ) {
				lowerCount++;
			}
		}
		let isAllUpperCase = ( upperCount * 1.0 / ( upperCount + lowerCount ) > 0.8 );

		let tokenList = new TokenList();
		let _this = this;
		retext()
			.use( retext_keywords, { maximum: 30 } )
			.process( text, ( err, file ) => {
				if ( err ) throw err;
				file.data.keywords.forEach( keywordObj => {
					let keyword = nlcstToString( keywordObj.matches[0].node );
					if ( Stoplist.perfectMatchWords.indexOf( keyword ) > -1 ) return;
					let lowercase = keyword.toLowerCase();
					if ( Stoplist.keywords.indexOf( lowercase ) > -1 ) return;
					tokenList.addToken( keyword, filename, _this._getStat( text, keyword, false ), isAllUpperCase );
				});
				file.data.keyphrases.forEach( keyphraseObj => {
					let keyphrase = keyphraseObj.matches[0].nodes.map(nlcstToString).join( '' );
					if ( keyphrase in tokenList.keywords ||
						!keyphrase.includes(' ') ||
						Stoplist.perfectMatchPhrases.indexOf( keyphrase ) > -1 ) return;
					let lowercase = keyphrase.toLowerCase();
					if ( Stoplist.keyphrases.indexOf( lowercase ) > -1 ) return;
					tokenList.addToken( keyphrase, filename, _this._getStat( text, keyphrase, false ), isAllUpperCase );
				});
			});
		return tokenList;
	}

	extractMultiple( filePathList, reset ) {
		reset = reset || false;
		if ( reset ) this.reset();
		let total = filePathList.length, success = 0;
		let ignoredFiles = [];
		filePathList.forEach( filePath => {
			let tokenList = this.extract( filePath );
			if ( tokenList ) {
				tokenList.mergeTo( this.keywordsDir, this.keyphrasesDir );
				success++;
			} else {
				total--;
				ignoredFiles.push( filePath );
			}
			log( `TokenExtractor: Processing transcripts, ${success}/${total} done.\n` );
		} );
		console.log( `TokenExtractor: ${ignoredFiles.length} transcripts ignored due to duplication\n` );
		ignoredFiles.forEach( fn => console.log( `\t${fn}` ));
	}

	/**
     * 
     * @param {String} token 
     */
    getFilenamesByToken( token ) {
		let filenames = [];

        let dir = token.includes( ' ' ) ? this.keyphrasesDir : this.keywordsDir;
		let lowercase = token.toLowerCase();
		let letter = lowercase.charAt( 0 );
		let file = dir + letter + '.json';
		let content = fs.readFileSync( file ).toString();                
		if ( content === "" ) {
			return filenames;
		} else {
			content = JSON.parse( content );
			if ( !( lowercase in content ) ) {
				return filenames;
			}
			for ( let variant in content[lowercase] ) {            
				if ( variant === ' CONTENT ' || variant === ' SCORE ' )
					continue;
				Object.keys( content[lowercase][variant] ).forEach( filename => {
					if ( filename !== ' SCORE ' ) {
						filenames.push( filename );
					}
				}) 
			}
		}

		return filenames;
    }

    /**
     * 
     * @param {Array of String} tokens 
     */
    getFilenamesByTokens( tokens ) {
        let filenames = [];
        tokens.forEach( token => {
			this.getFilenamesByToken( token ).forEach( filename => {
				if ( !( filename in filenames ) )
					filenames.push( filename );
			});
		});
        return filenames;
    }

	reset( resetDir ) {
		this.transcriptFilenames = [];
		this.keywordsDir = './compiled_data/keywords/';
		this.keyphrasesDir = './compiled_data/keyphrases/';
		if ( resetDir ) {
			this._resetDir( this.keywordsDir );
			this._resetDir( this.keyphrasesDir );
		}
	}

	_getStat( text, word, allowOverlapping ) {
		text += '';
		word += '';
		if ( word.length <= 0 ) return 0;
		let pos = 0, step = allowOverlapping ? 1 : word.length;
		let count = 0;

		while ( true ) {
			pos = text.indexOf( word, pos );
			if ( pos >= 0 ) {
				count++;
				pos += step;
			} else break;
		}

		return count;
	}

	// remove all files in keywordsDir and keyphrasesDir
	_resetDir( dirPath ) {
		let files = fs.readdirSync( dirPath );
		for ( let i = 0; i < files.length; i++ ) {
			let filePath = dirPath + '/' + files[i];
			if ( fs.statSync( filePath ).isFile() )
				fs.unlinkSync( filePath );
			else
				this._removeFiles( filePath );
		}
		for ( let letterCode = 'a'.charCodeAt( 0 ); letterCode <= 'z'.charCodeAt( 0 ); letterCode++ ) {
			fs.writeFileSync( dirPath + String.fromCharCode( letterCode ) + '.json', '' );
		}
	};

}

module.exports = TokensExtractor;
