const fs = require( 'fs' );
const retext = require( 'retext' );
const retext_keywords = require( 'retext-keywords' );
const nlcstToString = require( 'nlcst-to-string' );
const log = require( 'single-line-log' ).stdout;

const TokenList = require( './TokenList' );
const Stoplist = require( './Stoplist.js' );

/**
 * Extract tokens from .json transcripts.
 */
class TokensExtractor {

	constructor() {
		this.reset();
	}

	exportBrief() {
		return this.tokenList.exportBrief();
	}

	extract( filePath ) {
		let contents = fs.readFileSync( filePath ).toString();
		contents = contents.replace(/\r\n/, "\n");

		let startpos = 0, jsonStart = 0, jsonEnd = 0;
		let filename = "", text = "";

		while ( true ) {
			jsonStart = contents.indexOf( "{", startpos );
			if (jsonStart < 0) break;
			jsonEnd = contents.indexOf( "}\n", startpos );
			let fileLine = JSON.parse( contents.substring( jsonStart, jsonEnd + 1 ) );

			if ( fileLine.Filename ) {
				if ( this.transcriptFilenames.includes( fileLine.Filename ) ) {
					return null;
				} else {
					filename = fileLine.Filename;
					this.transcriptFilenames.push( filename );
				}
			}
			if ( fileLine.Text ) text += fileLine.Text + " ";

			startpos = jsonEnd + 1;
		}
		// remove extra spaces
		text = text.replace( /\s+/g,' ' ).trim();
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
			.use( retext_keywords, { maximum: Infinity } )
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
					if ( Stoplist.keywords.indexOf( lowercase ) > -1 ) return;
					tokenList.addToken( keyphrase, filename, _this._getStat( text, keyphrase, false ), isAllUpperCase );
				});
			});
		return tokenList;
	}

	extractMultiple( filePathList, reset, merge ) {
		reset = reset || false;
		merge = merge || true;
		if ( reset ) this.reset();
		let tokenList = new TokenList();
		let total = filePathList.length, success = 0;
		let ignoredFiles = [];
		filePathList.forEach( filePath => {
			let ret = this.extract( filePath );
			if ( ret ) {
				tokenList.mergeFrom( ret );
				success++;
			} else {
				total--;
				ignoredFiles.push( filePath );
			}
			log( `TokenExtractor: Processing transcripts, ${success}/${total} done.\n` );
		} );
		console.log( `TokenExtractor: ${ignoredFiles.length} transcripts ignored due to duplication\n` );
		ignoredFiles.forEach( fn => console.log( `\t${fn}` ));
		if ( merge ) {
			this.tokenList.mergeFrom( tokenList );
		}
		return tokenList;
	}

	reset() {
		this.transcriptFilenames = [];
		this.tokenList = new TokenList();
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

}

module.exports = TokensExtractor;
