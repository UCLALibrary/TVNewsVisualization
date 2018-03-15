import React, { Component } from 'react';
const fetch = require("isomorphic-fetch");
const { compose, withProps, withHandlers } = require("recompose");
const {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker,
} = require("react-google-maps");

const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

const MapWithAMarkerClusterer = compose(
	withProps({
		googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places",
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: <div style={{ height: `400px` }} />,
		mapElement: <div style={{ height: `100%` }} />,
		center: { lat: 25.03, lng: 121.6 }
	}),
	withHandlers({
		onMarkerClustererClick: () => (markerClusterer) => {
			const clickedMarkers = markerClusterer.getMarkers()
			console.log(`Current clicked markers length: ${clickedMarkers.length}`)
			console.log(clickedMarkers)
		},
	}),
	withScriptjs,
	withGoogleMap
)(props =>
	<GoogleMap
		defaultZoom={3}
		defaultCenter={{ lat: 25.0391667, lng: 121.525 }}
		
	>
	
	<InfoBox
			defaultPosition={new google.maps.LatLng(props.center.lat, props.center.lng)}
			options={{ closeBoxURL: ``, enableEventPropagation: true }}
		>
			<div style={{ backgroundColor: `teal`, opacity: 0.75, padding: `12px` }}>
				<div style={{ fontSize: `16px`, fontColor: `#08233B` }}>
					Hello, Taipei!
				</div>
			</div>
		</InfoBox>
		
				<Marker
			position={{ lat: -22.6273, lng: 120.3014 }}
			onClick={props.onToggleOpen}
		>
			{props.isOpen && <InfoBox
				onCloseClick={props.onToggleOpen}
				options={{ closeBoxURL: ``, enableEventPropagation: true }}
			>
				<div style={{ backgroundColor: `yellow`, opacity: 0.75, padding: `12px` }}>
					<div style={{ fontSize: `16px`, fontColor: `#08233B` }}>
						Hello, Kaohsiung!
					</div>
				</div>
			</InfoBox>}
		</Marker>
			
		<MarkerClusterer
			onClick={props.onMarkerClustererClick}
			averageCenter
			enableRetinaIcons
			gridSize={60}
		>
			{props.markers.map(marker => (
				<Marker
					key={marker.photo_id}
					position={{ lat: marker.latitude, lng: marker.longitude }}
				/>
			))}
		</MarkerClusterer>
	</GoogleMap>
);

class ReactMap extends React.PureComponent {
	componentWillMount() {
		this.setState({ markers: [] })
	}

	componentDidMount() {
		const url = [
			// Length issue
			`https://gist.githubusercontent.com`,
			`/farrrr/dfda7dd7fccfec5474d3`,
			`/raw/758852bbc1979f6c4522ab4e92d1c92cba8fb0dc/data.json`
		].join("")

		fetch(url)
			.then(res => res.json())
			.then(data => {
				this.setState({ markers: data.photos });
			});
	}

	render() {
		return (
			<MapWithAMarkerClusterer markers={this.state.markers} />
		)
	}
}

export default ReactMap;

