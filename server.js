const fs = require( 'fs' );
const path = require( 'path' );
const TokenExtractor = require( './TokenExtractor' );
const LocationExtractor = require( './LocationExtractor' );
const express = require( 'express' );
const app = express();

const read = ( dir ) =>
	fs.readdirSync( dir ).reduce( ( files, file ) =>
		fs.statSync( path.join( dir, file ) ).isDirectory() ?
			files.concat( read( path.join( dir, file ) ) ) :
			files.concat( path.join( dir, file ) ),
		[] );

const getFileNames = ( root, ext, recursive ) => {
	if ( !root || root.length <= 0 || !ext || ext.length <= 0 )
		return [];
	recursive = recursive || true;
	ext = ( ext[0] == '.' ? '' : '.' ) + ext;
	let result = read( root )
		.filter( fn => fn.substring( fn.length - ext.length, fn.length ) === ext )
	return result;
}

// Token
let jsonFiles = getFileNames( './data/2011', '.json' );
let tokenExtractor = new TokenExtractor();
tokenExtractor.extractMultiple( jsonFiles, true, true );
let briefTokenList = tokenExtractor.exportBrief();
// console.log( briefTokenList );

// Location
let segFiles = getFileNames( './data/', '.seg' );
let locationExtractor = new LocationExtractor();
locationExtractor.extractMultiple( segFiles, true, true );


app.set( "port", process.env.PORT || 3001 );

// Express only serves static assets in production
if ( process.env.NODE_ENV === "production" ) {
	app.use( express.static( "client/build" ));
}

app.get( "/api/tokenlist", ( req, res ) => {
	res.json( briefTokenList );
});

app.get( "/api/location", ( req, res ) => {
	const param = req.query.q;

	if ( !param ) {
		res.json({
			error: "Missing required parameer `q`"
		});
	} else {
		let UIDList = tokenExtractor.tokenList.getUIDsByTokens( JSON.parse( param ).tokens );
		res.json( locationExtractor.locationList.getLocationsByUIDs( UIDList ) );
	}
});

app.listen( app.get( "port" ), () => {
	console.log( `Find the server at: http://localhost:${app.get("port")}/` ); // eslint-disable-line no-console
});
