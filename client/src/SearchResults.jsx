import React, { Component } from 'react';
import { Card, Icon } from 'antd';

class SearchResults extends Component {
    render() {
        let file = this.props.selectedFile;
        let card = [];
        if ( file in this.props.searchResults ) {
            let { location, url } = this.props.searchResults[file];
            card.push((
                <Card key={file}>
                    <div>
                        <h3>{file}</h3>
                        <h4>Location: {location}</h4>
                        <a onClick={() => { window.open( url, '_blank'); }}>
                            <Icon type="video-camera" style={{ fontSize: 24 }}/>
                        </a>
                    </div>
                </Card>
            ));
        }
        return (
            <div className="search-results">
                {card}	
            </div>
        );
    }
}

export default SearchResults;
