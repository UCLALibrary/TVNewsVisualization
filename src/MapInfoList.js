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

    getCoordsByName( location ) {
        try {
            return { lat:0, long: 0 };
        } catch ( error ) {
            console.log(`Error: MapInfoList.getCoordsByName: failed to get coords for location ${location}.`);
        }
    }

    /**
     * Return type:
     * 
     * List of Strings
     */
    getMapInfoByFilenames( filenames ) {
        let mapInfo = {};
        filenames.forEach( filename => {
            if ( filename in this ) {
                let location = this.normalizeLocation( this[filename][' BEST_LOCATION '] );
                mapInfo[filename] = {
                    location: location,
                    coords: this.getCoordsByName( location ),
                    url: `http://tvnews.library.ucla.edu/videos/${filename}_main/video`
                };
            }
        });
        return mapInfo;
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
