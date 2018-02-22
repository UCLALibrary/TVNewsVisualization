// import { json } from "../../../../../../Library/Caches/typescript/2.6/node_modules/@types/body-parser";
// import { json } from 'body-parser';

function getTokenList( cb ) {
	return fetch( `/api/tokenlist`, {
		accept: "application/json"
	})
		.then( _checkStatus )
		.then( _parseJSON )
		.then( cb );
}

function getMapInfo( queryList, cb ) {
	return fetch( `/api/mapinfo?q=${JSON.stringify( { tokens: queryList } )}`, {
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

const Client = { getTokenList, getMapInfo };
export default Client;
