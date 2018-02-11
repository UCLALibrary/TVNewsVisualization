import React, { Component } from 'react';
import Client from './Client'
import { Icon, Input, AutoComplete} from 'antd';
import './SearchBox.css';
const Option = AutoComplete.Option;

class SearchBox extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
			dataSource: []
        };
		Client.search("someQuery", response => {
			this.setState({
				dataSource: response.keywords || []
            })
        });
    }

    // This method is called when typing in the search box
    onSearch = value => {
        console.log('onSearch', value);
    }

    // This method is called when a keyword in the dropdown list is selected
    onSelect = value => {
        console.log('onSelect', value);
    }

    /**
     * This method is used as a filter of items in the dropdown list.
     * @param inputValue - string typed in the search box
     * @param option     - an option from the dropdown list
     * @returns bool
     */
    filterOption = (inputValue, option) =>
        option.props.value ? 
            (option.props.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1)
        :   false;

    render() {
        let dataSource = this.state.dataSource.map(data => (
            <Option key={data.word} value={data.word}>
                {data.word}
                <span className="search-item-count">{data.count} searches</span>
            </Option>
        )).concat([
            <Option disabled key="all" className="show-all">
                <a
                    href="https://www.google.com/search?q=ucla"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    More results
                </a>
            </Option>
        ]);

        return (
            <div className="search-wrapper" style={{ width: 250 }}>
                <AutoComplete
                    className="search"
                    dropdownClassName="search-dropdown"
                    dropdownMatchSelectWidth={true}
                    // dropdownStyle={{ width: 500 }}  // effective only when dropdownMatchSelectWidth is false
                    size="large"
                    style={{ width: '100%' }}
                    dataSource={dataSource}
                    onSelect={this.onSelect}
                    onSearch={this.onSearch}
                    placeholder="input here"
                    optionLabelProp="value"
                    filterOption={this.filterOption}
                >
                <Input suffix={<Icon type="search" className="search-icon" />} />
                </AutoComplete>
            </div>
        );
    }
}
// 搞一个clear的大叉按钮

export default SearchBox;