const Client = require( './Client' );

class MapInfoList {
    
    /**
     * The Structure:
     * 
     * MapInfoList: {
     *      filename1: {
     *          location1: # of mentions,   // locations all lowercased
     *          location2: # of mentions
     *      },
     *      filename2: {
     *          'new york': 2,
     *          'washington': 5
     *      },
     *      ...
     * }
     */
    constructor() {
    }

    /**
     * Return type:
     * 
     * List of Strings
     */
    getMapInfoByFilenames( filenames, callback ) {
        let mapInfo = {};
        let promises = [];

        filenames.forEach( filename => {
            let location = this.normalizeLocation( this[filename][' BEST_LOCATION '] );
            if ( location && location !== "" ) {
                promises.push(
                    Client.getCoords( location, response => {
                        if ( !response || response.response.numFound === 0 )
                            throw `No results found for "${location}"`;
                        let result = response.response.docs[0];
                        return {
                            filename: filename,
                            location: result.name,
                            lat: result.lat,
                            lng: result.lng
                        };
                    }).catch ( error => {
                        console.log( `Error: MapInfoList.getCoordsByName: failed to get coords for location "${location}" in transcript "${filename}".` );
                        console.log( error );
                    })
                );
            }
        });

        return Promise.all( promises ).then( mapInfoArr => {
            mapInfoArr.forEach( item => {
                mapInfo[item.filename] = {
                    location: item.location,
                    lat: item.lat,
                    lng: item.lng,
                    url: `http://tvnews.library.ucla.edu/videos/${item.filename}_main/video`
                };            
            });

            callback( mapInfo );
        });
    }

    mergeFrom( other ) {
        for ( let filename in other ) {
            this[filename] = other[filename];
        }
    }

    normalizeLocation( location ) {
        switch ( location ) {
            // case 'l.a.':    return 'los angeles';
            default:        return location;
        }
    }

    setLocation( filename, locationStat ) {
        // all locations in locationStat should already be lowercased
        let bestLoc = "", maxMentions = 0;
        for ( let location in locationStat ) {
            if ( locationStat[location] > maxMentions ) {
                bestLoc = location;
                maxMentions = locationStat[location];
            }
        }
        locationStat[' BEST_LOCATION '] = bestLoc;
        this[filename] = locationStat;
    }

}

module.exports = MapInfoList;
