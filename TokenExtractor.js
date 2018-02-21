const fs = require( 'fs' );
const retext = require( 'retext' );
const retext_keywords = require( 'retext-keywords' );
const nlcstToString = require( 'nlcst-to-string' );

const TokenList = require( './TokenList' );

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
		let startpos = 0, jsonStart = 0, jsonEnd = 0;
		let UID = "", text = "";

		while ( true ) {
			jsonStart = contents.indexOf( "{", startpos );
			if (jsonStart < 0) break;
			// if ( UID === "fa87bb16-c7b1-11e0-9bb3-001fc65c7848" && jsonStart === 34184 ) {
			// 	jsonEnd = jsonStart + 132;
			// } else if ( UID === "fa87bb16-c7b1-11e0-9bb3-001fc65c7848" && jsonStart === 38179 ) {
			// 	jsonEnd = jsonStart + 122;
			// } else if ( UID === "258ce714-c7b2-11e0-8f8a-001fc65c7848" && jsonStart === 97660 ) {
			// 	jsonEnd = jsonStart + 110;
			// } else if ( UID === "258ce714-c7b2-11e0-8f8a-001fc65c7848" && jsonStart === 99226 ) {
			// 	jsonEnd = jsonStart + 124;
			// } else if ( UID === "258ce714-c7b2-11e0-8f8a-001fc65c7848" && jsonStart === 106206 ) {
			// 	jsonEnd = jsonStart + 108;
			// } else if ( UID === "7b110550-1752-11e0-adc8-001517add6f2" && jsonStart === 236364 ) {
			// 	jsonEnd = jsonStart + 134;
			// } else if ( UID === "3955ea48-c7b7-11e0-8d24-001fc65c7848" && jsonStart === 6445 ) {
			// 	jsonEnd = jsonStart + 109;
			// } else if ( UID === "3955ea48-c7b7-11e0-8d24-001fc65c7848" && jsonStart === 44775 ) {
			// 	jsonEnd = jsonStart + 975;
			// } else if ( UID === "3955ea48-c7b7-11e0-8d24-001fc65c7848" && jsonStart === 49886 ) {
			// 	jsonEnd = jsonStart + 111;
			// } else {
				jsonEnd = contents.indexOf( "}\n", startpos );
			//}
			let fileLine = JSON.parse( contents.substring( jsonStart, jsonEnd + 1 ) );

			if ( fileLine.UID ) {
				if ( this.transcriptUIDs.includes( fileLine.UID ) ) {
					console.log( `TokenExtractor: Ignored duplicate transcript ${filePath}` );
					return null;
				} else {
					UID = fileLine.UID;
					this.transcriptUIDs.push( UID );
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
					if ( false /* || keyword in keyword stoplist */ ) return;
					let lowercase = keyword.toLowerCase();
					tokenList.addToken( keyword, UID, _this._getStat( text, keyword, false ), isAllUpperCase );
				});
				file.data.keyphrases.forEach( keyphraseObj => {
					let keyphrase = keyphraseObj.matches[0].nodes.map(nlcstToString).join( '' );
					if ( keyphrase in tokenList.keywords ||
						!keyphrase.includes(' ') /* || keyphrase in keyphrase stoplist */ ) return;
					let lowercase = keyphrase.toLowerCase();
					tokenList.addToken( keyphrase, UID, _this._getStat( text, keyphrase, false ), isAllUpperCase );
				});
			});
		console.log( `TokenExtractor: Process transcript ${filePath} done` );
		return tokenList;
	}

	extractMultiple( filePathList, reset, merge ) {
		reset = reset || false;
		merge = merge || true;
		if ( reset ) this.reset();
		let tokenList = new TokenList();
		filePathList.forEach( filePath => {
			let ret = this.extract( filePath );
			if ( ret ) tokenList.mergeFrom( ret );
		 } );
		if ( merge ) {
			this.tokenList.mergeFrom( tokenList );
		}
		return tokenList;
	}

	reset() {
		this.transcriptUIDs = [];
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
