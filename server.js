const fs = require( 'fs' );
const path = require( 'path' );
const TokensExtractor = require( './TokensExtractor' );
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

let jsonFiles = getFileNames( './data/2011-01-01/', '.json' );
let transcripts = jsonFiles;
// [
// 	'./data/2011-01-01/2011-01-01_0000_US_CNN_CNN_Tonight.json'
// ]

let tokensExtractor = new TokensExtractor();
tokensExtractor.extractMultiple( transcripts, 20, true, true );
let briefTokenList = tokensExtractor.exportBrief();
console.log( briefTokenList );

app.set( "port", process.env.PORT || 3001 );

// Express only serves static assets in production
if ( process.env.NODE_ENV === "production" ) {
	app.use( express.static("client/build" ));
}

app.get( "/api/searchbar", ( req, res ) => {
	const param = req.query.q;

	if ( !param ) {
		res.json({
			error: "Missing required parameter `q`"
		});
		return;
	} else if ( param !== "tokens" ) {
		res.json({
			error: "Unknown query"
		});
	}

	res.json( briefTokenList );
});

app.listen( app.get( "port" ), () => {
	console.log( `Find the server at: http://localhost:${app.get("port")}/` ); // eslint-disable-line no-console
});
