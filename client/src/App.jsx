import React, { Component } from 'react';
// import logo from './logo.svg';
import SearchBox from './SearchBox.jsx';
import SeachResults from './SearchResults.jsx';
import MapContainer from './MapContainer.jsx';
import './App.css';
import { Layout, Menu, Row, Col } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

class App extends Component {
	state = {
		searchResults: {},
		selectedFile: null
	};

	onSearchResult = results => {
		this.setState({
			searchResults: results,
			selectedFile: null
		});
	}

	onSelectSearchResult = file => {
		this.setState({
			selectedFile: file
		})
	}

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
						<Col span={15}>
							<Content>
								<MapContainer
									searchResults={this.state.searchResults}
									onSelectSearchResult={this.onSelectSearchResult}
									selectedFile={this.state.selectedFile}
								/>
							</Content>
						</Col>
						<Col span={9}>
							<Sider width='100%'>
								<Row>
									<SearchBox limit={5} onSearchResult={this.onSearchResult}/>
								</Row>
								<Row className="search-results-wrapper">
									<SeachResults
										searchResults={this.state.searchResults}
										selectedFile={this.state.selectedFile}
									/>
								</Row>
							</Sider>
						</Col>
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

