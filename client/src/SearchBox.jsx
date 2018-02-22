import React, { Component } from 'react';
import Client from './Client'
import { Col, Select, Button, Icon } from 'antd';
import './SearchBox.css';
const { Option, OptGroup } = Select;

class SearchBox extends Component {
    constructor( props ) {
        super( props );
        
        this.state = {
            allDataSource:  { keywords: [], keyphrases: [] },
            dataSource: { keywords: [], keyphrases: [] },
            limit: { keywords: this.props.limit, keyphrases: this.props.limit },
            selected: []
        };
		Client.getTokenList( response => {
            console.log( response );
			this.setState({
                allDataSource: response || [],
                dataSource: response || []
            })
        });
    }

    getOptions( src, keyName, moreResultsTarget ) {
        let options = [];
        for ( let i in src.slice( 0, this.state.limit[moreResultsTarget] ) ) {
            options.push((
                <Option key={src[i].content} value={src[i].variant}>
                    {src[i].variant}
                    <span className="search-item-stat">{src[i].news} news, {src[i].mentions} mentions</span>
                </Option>
            ));
        }
        if ( this.state.limit[moreResultsTarget] === this.props.limit ) {
            options.push((
                <Option disabled key={keyName} className="show-all">
                    <a onClick={() => { this.handleMoreResults( moreResultsTarget ); }}>
                        <Icon type="down" />
                    </a>
                </Option>));
        } else {
            options.push((
                <Option disabled key={keyName} className="show-all">
                    <Col span={12}>
                        <a onClick={() => { this.handleLessResults( moreResultsTarget ); }}>
                            <Icon type="up" />
                        </a>
                    </Col>
                    <Col span={12}>
                        <a onClick={() => { this.handleMoreResults( moreResultsTarget ); }}>
                            <Icon type="down" />
                        </a>
                    </Col>
                </Option>));
        }

        return options;
    }

    handleButtonSearch = () => {
        console.log( 'handleButtonSearch' );
        Client.getMapInfo( this.state.selected, response => {
            console.log( response );
        })
    }

    handleButtonCancel = () => {
        console.log( 'handleButtonCancel' );
        this.setState({
            selected: []
        })
    }

    handleLessResults = target => {
        let newLimit = this.state.limit;
        newLimit[target] -= this.props.limit;
        this.setState({
            limit: newLimit
        })
    }

    handleMoreResults = target => {
        let newLimit = this.state.limit;
        newLimit[target] += this.props.limit;
        this.setState({
            limit: newLimit
        })
    }

    onDeselect = value => {
        console.log( 'onDeselect', value );
        let newSelected = this.state.selected;
        newSelected.splice( newSelected.indexOf( value ), 1 );
        this.setState({
            selected: newSelected
        })
    }

    onSearch = value => {
        console.log( 'onSearch', value );
        this.setState({
            dataSource: {
                keywords: this.state.allDataSource.keywords.filter(
                        data => data.content.includes( value.toLowerCase() )
                    ),
                keyphrases: this.state.allDataSource.keyphrases.filter(
                        data => data.content.includes( value.toLowerCase() )
                    )
            }
        });
    }

    onSelect = value => {
        console.log( 'onSelect', value );
        let newSelected = this.state.selected;
        newSelected.push( value );
        this.setState({
            selected: newSelected
        })
    }


    render() {
        let dataSource = [
            (<OptGroup label="Keywords">
                {this.getOptions(this.state.dataSource.keywords, "moreKeywords", "keywords")}
            </OptGroup>),
            (<OptGroup label="Keyphrases">
                {this.getOptions(this.state.dataSource.keyphrases, "moreKeyphrases", "keyphrases")}
            </OptGroup>)
        ];

        return (
            <div className="search-wrapper">
                <Col span={20}>
                    <Select
                        mode="multiple"
                        className="search"
                        dropdownClassName="search-dropdown"
                        dropdownMatchSelectWidth={true}
                        // dropdownStyle={{ width: 500 }}  // effective only when dropdownMatchSelectWidth is false
                        // size="large"
                        style={{ width: '100%' }}
                        placeholder="Search for topics"
                        onSelect={this.onSelect}
                        onDeselect={this.onDeselect}
                        onSearch={this.onSearch}
                        optionLabelProp="value"
                        filterOption={() => true}
                        value={this.state.selected}
                    >
                        {dataSource}
                    </Select>
                </Col>
                <Col span={2}>
                    <Button className="search-button" 
                            shape="circle"
                            icon="search"
                            onClick={this.handleButtonSearch}/>
                </Col>
                <Col span={2}>
                    <Button className="cancel-button" 
                            shape="circle"
                            icon="cross"
                            onClick={this.handleButtonCancel}/>
                </Col>
            </div>
        );
    }
}

export default SearchBox;
