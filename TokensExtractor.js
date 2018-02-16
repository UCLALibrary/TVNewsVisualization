const fs = require( 'fs' );
const retext = require( 'retext' );
const retext_keywords = require( 'retext-keywords' );
const nlcstToString = require( 'nlcst-to-string' );

const TokenList = require( './TokenList' );

class TokensExtractor {

	constructor() {
		this.reset();
	}

	exportBrief() {
		return this.tokenList.exportBrief();
	}

	extract( filePath ) {
		let duplicate = false;

		let contents = fs.readFileSync( filePath ).toString();
		let startpos = 0, jsonStart = 0, jsonEnd = 0;
		let UID = "", text = "";

		while ( true ) {
			jsonStart = contents.indexOf( "{", startpos );
			if (jsonStart < 0) break;
			jsonEnd = contents.indexOf( "}", startpos );
			let fileLine = JSON.parse( contents.substring( jsonStart, jsonEnd + 1 ) );

			if ( fileLine.UID ) {
				if ( this.transcriptUIDs.includes( fileLine.UID ) ) {
					duplicate = true;
					console.log( `Ignored duplicate transcript ${filePath}` );
					return;
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
		console.log( `Process transcript ${filePath} done` );
		return tokenList;
	}

	extractMultiple( filePathList, reset, merge ) {
		reset = reset || false;
		merge = merge || true;
		if ( reset ) this.reset();
		let tokenList = new TokenList();
		filePathList.forEach( filePath => {
			tokenList.mergeFrom( this.extract( filePath ) );
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




