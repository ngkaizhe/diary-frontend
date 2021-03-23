// react modules
import React from 'react';
import axios from 'axios';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

// css files
import './App.scss';
import DiaryDashboard from 'DiaryDashboard';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			hasLogin: false,
			user_token: '',
		}
	}
	render() {
		var page;

		if (this.state.hasLogin) {
			page = <DiaryDashboard />;
		}
		else {
			page = <Register />;
		}

		return (
			page
		);
	}
}

class Register extends React.Component {
	render() {
		return (
			<h2>register</h2>
		);
	}
}

export default App;
