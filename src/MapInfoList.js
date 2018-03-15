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
        this[' LATLNGCACHE '] = {};
        this[' FILEINFOCACHHE '] = {};
    }

    /**
     * Return type:
     * 
     * List of Strings
     */
    getMapInfoByFilenames( filenames, callback ) {
        let mapInfo = {};
        let pendingLocations = [];
        let pendingFiles = {};
        let promises = [];

        filenames.forEach( filename => {
            // If no such filename, ignore
            if ( !( filename in this ) )
                return;

            // If we have mapInfo for that file in cache --> cache hit!
            if ( filename in this[' FILEINFOCACHHE '] ) {
                mapInfo[filename] = this[' FILEINFOCACHHE '][filename];
                return;
            }

            // Otherwise, get the location of the file
            let location = this.normalizeLocation( this[filename][' BEST_LOCATION '] );
            
            // If we have the location in cache --> cache hit! Then update teh fileInfo cache
            if ( location in this[' LATLNGCACHE '] ) {
                mapInfo[filename] = {
                    location: location,
                    lat: this[' LATLNGCACHE '][location].lat,
                    lng: this[' LATLNGCACHE '][location].lng,
                    url: `http://tvnews.library.ucla.edu/videos/${filename}_main/video`
                }
                this[' FILEINFOCACHHE '][filename] = mapInfo[filename];
            } else if ( location && location !== "" ) {
                // If location cache miss, add location to newLocations
                pendingFiles[filename] = location;
                if ( pendingLocations.indexOf( location ) === -1 )
                    pendingLocations.push( location );
            }
        })

        pendingLocations.forEach( location => {
            if ( location && location !== "" ) {
                promises.push(
                    Client.getCoords( location, response => {
                        if ( !response || response.response.numFound === 0 )
                            throw `No results found for "${location}"`;
                        let result = response.response.docs[0];
                        this[' LATLNGCACHE '][location] = {
                            lat: ( result ? result.lat : null ),
                            lng: ( result ? result.lng : null )
                        };
                    }).catch ( error => {
                        console.log( `Error: MapInfoList: failed to get coords for location "${location}".` );
                        console.log( error );
                        this[' LATLNGCACHE '][location] = {
                            lat: null,
                            lng: null
                        };
                    })
                );
            }
        });


        return Promise.all( promises ).then( () => {
            for ( let filename in pendingFiles ) {
                let location = pendingFiles[filename];
                mapInfo[filename] = {
                    location: location,
                    lat: this[' LATLNGCACHE '][location].lat,
                    lng: this[' LATLNGCACHE '][location].lng,
                    url: `http://tvnews.library.ucla.edu/videos/${filename}_main/video`
                }
                this[' FILEINFOCACHHE '][filename] = mapInfo[filename];
            }
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
