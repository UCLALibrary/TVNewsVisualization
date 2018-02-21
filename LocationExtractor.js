const fs = require( 'fs' );
const retext = require( 'retext' );
const retext_keywords = require( 'retext-keywords' );
const nlcstToString = require( 'nlcst-to-string' );

const LocationList = require( './LocationList' );

/**
 * Extract locations from .seg transcripts.
 */
class LocationExtractor {

	constructor() {
		this.reset();
	}

	extract( filePath ) {
		let contents = fs.readFileSync( filePath ).toString();
		
		let UIDPos = contents.indexOf( "UID|" );
        if ( UIDPos < 0 ) {
            console.log( `LocationExtractor: Ignored transcript ${filePath} with no UID` );
			return;
		}
		let endOfLine = contents.indexOf( "\n", UIDPos );
		let UID = contents.substring( UIDPos + 4, endOfLine );

		if ( this.transcriptUIDs.includes( UID ) ) {
			console.log( `LocationExtractor: Ignored duplicate transcript ${filePath}` );
			return;
		} else {
			this.transcriptUIDs.push( UID );
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

		console.log( `LocationExtractor: Process transcript ${filePath} done` );
		return {
			UID: UID,
			locations: locations
		};
	}

	extractMultiple( filePathList, reset, merge ) {
		reset = reset || false;
		merge = merge || true;
		if ( reset ) this.reset();
		let locationList = new LocationList();
		filePathList.forEach( filePath => {
			let retVal = this.extract( filePath );
			locationList.setLocation( retVal.UID, retVal.locations );
		});
		if ( merge ) {
			this.locationList.mergeFrom( locationList );
		}
		return locationList;
	}

	reset() {
		this.transcriptUIDs = [];
		this.locationList = new LocationList();
	}

}

module.exports = LocationExtractor;
