import React, { Component } from 'react';
// import logo from './logo.svg';
import SearchBox from './SearchBox.jsx';
import SeachResults from './SearchResults.jsx';
import Map from './Map.jsx';
import './App.css';
import { Layout, Menu, Row } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

class App extends Component {
	state = {
		
	};

	render() {
		return (
			<div className="App">
				<Layout>
					<Header>
						<div className="logo" />
						<Menu
							mode="horizontal"
							defaultSelectedKeys={['2']}
						>
							<Menu.Item key="1">nav 1</Menu.Item>
							<Menu.Item key="2">nav 2</Menu.Item>
							<Menu.Item key="3">nav 3</Menu.Item>
						</Menu>
					</Header>
					<Layout className="middle-layout">
						<Content>
							<Map />
						</Content>
						<Sider width='540px'>
						<Row>
							<SearchBox limit={5}/>
						</Row>
						<Row className="search-results-wrapper">
							<SeachResults />
						</Row>
						</Sider>
					</Layout>
					<Footer>
						Footer
					</Footer>
				</Layout>
			</div>
		);
	}
}

export default App;

