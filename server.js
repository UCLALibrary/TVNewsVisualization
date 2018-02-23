const fs = require( 'fs' );
const path = require( 'path' );
const TokenExtractor = require( './src/TokenExtractor' );
const MapInfoExtractor = require( './src/MapInfoExtractor' );
const express = require( 'express' );


// Utility functions
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


// Cache tokens
let jsonFiles = getFileNames( './data/2011/2011-01/2011-01-01/', '.json' );
let tokenExtractor = new TokenExtractor();
tokenExtractor.extractMultiple( jsonFiles, true, true );
let briefTokenList = tokenExtractor.exportBrief();
// console.log( briefTokenList );


// Cache map information
let segFiles = getFileNames( './data/2011/2011-01/2011-01-01/', '.seg' );
let mapInfoExtractor = new MapInfoExtractor();
mapInfoExtractor.extractMultiple( segFiles, true, true );


// Express stuff
const app = express();
app.set( "port", process.env.PORT || 3001 );

// Express only serves static assets in production
if ( process.env.NODE_ENV === "production" ) {
	app.use( express.static( "client/build" ));
}

app.get( "/api/tokenlist", ( req, res ) => {
	res.json( briefTokenList );
});

app.get( "/api/mapinfo", ( req, res ) => {
	const param = req.query.q;

	if ( !param ) {
		res.json({
			error: "Missing required parameer `q`"
		});
	} else {
		let filenames = tokenExtractor.tokenList.getFilenamesByTokens( JSON.parse( param ).tokens );
		res.json( mapInfoExtractor.mapInfoList.getMapInfoByFilenames( filenames ) );
	}
});

app.listen( app.get( "port" ), () => {
	console.log( `Find the server at: http://localhost:${app.get("port")}/` ); // eslint-disable-line no-console
});
