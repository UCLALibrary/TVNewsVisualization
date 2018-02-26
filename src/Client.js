// import { json } from "../../../../../../Library/Caches/typescript/2.6/node_modules/@types/body-parser";
// import { json } from 'body-parser';

const fetch = require( 'isomorphic-fetch' );

function getCoords( query, cb ) {
	return fetch( `http://marinus.library.ucla.edu:8008/fulltext/fulltextsearch?format=json&allwordsrequired=true&spellchecking=false&from=1&to=1&q=${query}`, {
		accept: "application/json"
	})
		.then( _checkStatus )
		.then( _parseJSON )
		.then( cb );
}

function _checkStatus( response ) {
	if ( response.status >= 200 && response.status < 300 ) {
		return response;
	}
	const error = new Error( `HTTP Error ${response.statusText}` );
	error.status = response.statusText;
	error.response = response;
	console.log( error ); // eslint-disable-line no-console
	throw error;
}

function _parseJSON( response ) {
	return response.json();
}

const Client = { getCoords };
module.exports = Client;


