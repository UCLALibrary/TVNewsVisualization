const fs = require( 'fs' );
const retext = require( 'retext' );
const retext_keywords = require( 'retext-keywords' );
const nlcstToString = require( 'nlcst-to-string' );

const MapInfoList = require( './MapInfoList' );

/**
 * Extract information for the map from .seg transcripts.
 * Locations and video urls.
 */
class MapInfoExtractor {

	constructor() {
		this.reset();
	}

	extract( filePath ) {
		let contents = fs.readFileSync( filePath ).toString();
		// TOP|20110102020001|2011-01-02_0200_US_KABC_KABC_Saturday_News 19
		let filenameStart = "TOP|yyyymmddhhmm**|".length;
        
		let endOfLine = contents.indexOf( "\n", filenameStart );
		let filename = contents.substring( filenameStart, endOfLine );

		if ( this.transcriptFilenames.includes( filename ) ) {
			console.log( `MapInfoExtractor: Ignored duplicate transcript ${filePath}` );
			return;
		} else {
			this.transcriptFilenames.push( filename );
		}

		// find substring starts with "|LOCATION" and ends with "|" or "\n"
		let locations = {};
		let locationStart = 0, locationEndPlus1 = 0;
		const tag = "|LOCATION=";
		while ( true ) {
			locationStart = contents.indexOf( tag, locationEndPlus1 + 1 );
			if ( locationStart < 0 ) break;
			locationEndPlus1 = Math.min(
				contents.indexOf( "\n", locationStart + tag.length ), 
				contents.indexOf( "|", locationStart + tag.length )
			);
			
			let location = contents.substring( locationStart + tag.length, locationEndPlus1 )
				.toLowerCase();
			if ( location in locations ) {
				locations[location]++;
			} else {
				locations[location] = 1;
			}
		}		

		console.log( `MapInfoExtractor: Process transcript ${filePath} done` );
		return {
			filename: filename,
			locations: locations
		};
	}

	extractMultiple( filePathList, reset, merge ) {
		reset = reset || false;
		merge = merge || true;
		if ( reset ) this.reset();
		let mapInfoList = new MapInfoList();
		filePathList.forEach( filePath => {
			let retVal = this.extract( filePath );
			mapInfoList.setLocation( retVal.filename, retVal.locations );
		});
		if ( merge ) {
			this.mapInfoList.mergeFrom( mapInfoList );
		}
		return mapInfoList;
	}

	reset() {
		this.transcriptFilenames = [];
		this.mapInfoList = new MapInfoList();
	}

}

module.exports = MapInfoExtractor;
