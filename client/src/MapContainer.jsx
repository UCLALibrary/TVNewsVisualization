import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

export class MapContainer extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
        }

        // binding this to event-handler functions
        this.onMarkerClick = this.onMarkerClick.bind( this );
    }

    onMarkerClick = ( props, marker, e ) => {
        this.props.onSelectSearchResult( props.file );
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
        
    }
    
    onMapClicked = props => {
        if ( this.state.showingInfoWindow ) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    }
  
    render() {
        let google = this.props.google;
        if ( !this.props.loaded ) {
            return <div>Loading...</div>;
        }
        let markers = [];
        for ( let file in this.props.searchResults ) {
            let { location, lat, lng, url } = this.props.searchResults[file];
            markers.push((
                <Marker
                    file={file}
                    location={location}
                    position={{lat: lat, lng: lng}}
                    url={url}
                    onClick={this.onMarkerClick}
                />
            ))
        }
        if ( this.state.showingInfoWindow && !this.props.selectedFile ) {
            this.setState({
                showingInfoWindow: false
            })
        }

        return (
            <Map
                google={google}
                initialCenter={{
                    lat: 39.7599983215332,
                    lng: -98.5
                }}
                zoom={2}
                onClick={this.onMapClicked}
            >
                {markers}
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                >
                    <div>
                        <h1>{this.state.selectedPlace.location}</h1>
                        <h4>
                            <a onClick={() => { window.open( this.state.selectedPlace.url, '_blank'); }}>
                                {this.state.selectedPlace.file}
                            </a>
                        </h4>
                    </div>
                </InfoWindow>
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ( 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo' )
})( MapContainer )