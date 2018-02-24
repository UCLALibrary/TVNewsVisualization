import React, { Component } from 'react';
import { Card } from 'antd';

class SearchResults extends Component {
    render() {
        return (
            <div className="search-results">
                <Card>
                    <p>News content 1</p>
                    <p>News content 1</p>
                    <p>News content 1</p>
                </Card>
                <Card>
                    <p>News content 2</p>
                    <p>News content 2</p>
                    <p>News content 2</p>
                </Card>
                <Card>
                    <p>News content 3</p>
                    <p>News content 3</p>
                    <p>News content 3</p>
                </Card>
                <Card>
                    <p>News content 4</p>
                    <p>News content 4</p>
                    <p>News content 4</p>
                </Card>
                <Card>
                    <p>News content 5</p>
                    <p>News content 5</p>
                    <p>News content 5</p>
                </Card>
							
            </div>
        );
    }
}

export default SearchResults;
