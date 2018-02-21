import React, { Component } from 'react';
// import logo from './logo.svg';
import SearchBox from './SearchBox.jsx';
import { Col } from 'antd';
import './App.css';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Col span={4}/>
				<Col span={20}>
					<SearchBox limit={5}/>
				</Col>
			</div>
		);
	}
}

export default App;
