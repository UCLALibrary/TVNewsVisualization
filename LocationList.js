class LocationList {
    
    /**
     * The Structure:
     * 
     * LocationList: {
     *      UID1: {
     *          location1: # of mentions,   // locations all lowercased
     *          location2: # of mentions
     *      },
     *      UID2: {
     *          'new york': 2,
     *          'Washington': 5
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
    getLocationsByUIDs( UIDList ) {
        let retLocations = {};
        UIDList.forEach( UID => {
            console.log("LocationList.getLocationsByUIDs", UID);
            if ( UID in this )
                retLocations[UID] = this[UID][' BEST_LOCATION '];
        });
        return retLocations;
    }

    mergeFrom( other ) {
        for ( let UID in other ) {
            this[UID] = other[UID];
        }
    }

    setLocation( UID, locationStat ) {
        // all locations in locationStat should already be lowercased
        let bestLoc = "", maxMentions = 0;
        for ( let location in locationStat ) {
            if ( locationStat[location] > maxMentions ) {
                bestLoc = location;
                maxMentions = locationStat[location];
            }
        }
        locationStat[' BEST_LOCATION '] = bestLoc;
        this[UID] = locationStat;
    }

}

module.exports = LocationList;
