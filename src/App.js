// react modules
import React from 'react';

// bulma modules
import Navbar from 'react-bulma-components/lib/components/navbar';
import Box from 'react-bulma-components/lib/components/box';
import Heading from 'react-bulma-components/lib/components/heading';
import Columns from 'react-bulma-components/lib/components/columns';
import { Field, Control, Label, Input, Help } from 'react-bulma-components/lib/components/form';
import Button from 'react-bulma-components/lib/components/button';

// css files
import './App.scss';

// children modules
import DiaryDashboard from 'DiaryDashboard';
import { apiClient } from 'DiaryDashboard';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.handleSetUserToken = this.handleSetUserToken.bind(this);
		this.logout = this.logout.bind(this);
	}

	handleSetUserToken(user_token, username) {
		sessionStorage.setItem('user_token', user_token);
		sessionStorage.setItem('username', username);
		this.forceUpdate();
	}

	logout() {
		this.forceUpdate();
	}

	render() {
		var page;
		var hasLogin = sessionStorage.getItem('user_token') ? true : false;

		if (hasLogin) {
			page = <DiaryDashboard
				logout={this.logout}
			/>;
		}
		else {
			page = <AuthPage
				handleSetUserToken={this.handleSetUserToken}
			/>;
		}

		return (
			page
		);
	}
}

class AuthPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoginPage: true,

			// navbar burger
			isActive: false,
		}

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(evt) {
		const value = evt.target.value;
		this.setState({
			[evt.target.name]: value,
		});
	}

	handleChangeRoute(isLoginPage) {
		this.setState({
			isLoginPage: isLoginPage
		});
	}

	render() {
		var navbarHTML =
			<Navbar color="dark">
				<Navbar.Brand>
					<Navbar.Item renderAs="a" href="#">
						My Diary
						</Navbar.Item>
					<a
						onClick={() => {
							this.setState((state) => ({
								isActive: !state.isActive
							}));
						}}
						role="button"
						className={`navbar-burger burger ${this.state.isActive ? "is-active" : ""}`}
						aria-label="menu"
						aria-expanded="false"
						data-target="navbarBasicExample"
					>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					</a>
				</Navbar.Brand>
				<div
					id="navbarBasicExample"
					className={`navbar-menu ${this.state.isActive ? "is-active" : ""}`}
				>

					<div className="navbar-end">
						<a
							className="navbar-item"
							onClick={this.handleChangeRoute.bind(this, false)}
						>Register
        				</a>
						<a
							className="navbar-item"
							onClick={this.handleChangeRoute.bind(this, true)}
						>Login
        				</a>
					</div>
				</div>
			</Navbar>
			;

		if (this.state.isLoginPage) {
			return (
				<div>
					{/* navbar part */}
					{navbarHTML}

					<Login
						handleSetUserToken={this.props.handleSetUserToken}
					></Login>
				</div>
			);
		}
		else {
			return (
				<div>
					{/* navbar part */}
					{navbarHTML}

					<Register
						changeRouteToLoginPage={this.handleChangeRoute.bind(this, true)}
					></Register>
				</div>
			);
		}
	}
}

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',

			error: [],
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}

	handleChange(evt) {
		const value = evt.target.value;
		this.setState({
			[evt.target.name]: value,
		});
	}

	handleLogin(e) {
		this.setState({
			error: [],
		});

		apiClient.get(process.env.REACT_APP_BACKEND_DOMAIN + '/sanctum/csrf-cookie')
			.then(response => {
				apiClient({
					method: 'POST',
					url: process.env.REACT_APP_BACKEND_DOMAIN + '/api/login',
					headers: {
						Accept: "application/json",
					},
					data: this.state,
				}).then((response) => {
					this.setState({
						error: [],
					});

					var token = response.data.token;
					this.props.handleSetUserToken(token, response.data.username);
				}).catch((error) => {
					if (error.response) {
						var errors = [];

						for (var key in error.response.data.message) {
							error.response.data.message[key].forEach((value) => {
								errors.push(value);
							});
						}

						this.setState({
							error: errors,
						});
					}
				});
			});

		e.preventDefault();
	}

	render() {
		var error;

		if (this.state.error.length !== 0) {
			error = <Help color="danger">The credential is invalid!</Help>
		}

		return (
			<Columns>
				<Columns.Column size="half" offset="one-quarter">
					<Box
						style={{
							marginTop: "50px",
						}}>
						<Heading>
							Login Page
						</Heading>

						<form>
							{/* user input part */}
							<Field>
								<Label>Email</Label>
								<Control>
									<Input
										onChange={this.handleChange}
										name="email"
										type="email"
										placeholder="Email"
										color="black"
										value={this.state.email}
									/>
								</Control>
							</Field>

							<Field>
								<Label>Password</Label>
								<Control>
									<Input
										onChange={this.handleChange}
										name="password"
										type="password"
										placeholder="Password"
										color="black"
										value={this.state.password}
									/>
								</Control>
								{error}
							</Field>

							<Field>
								<Control>
									<Button
										type="submit"
										color="link"
										onClick={this.handleLogin}
									>Login</Button>
								</Control>
							</Field>
						</form>
					</Box>
				</Columns.Column>
			</Columns>
		);
	}
}

class Register extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			email: '',
			password: '',
			password_confirmation: '',

			error: [],
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleRegister = this.handleRegister.bind(this);
	}

	handleChange(evt) {
		const value = evt.target.value;
		this.setState({
			[evt.target.name]: value,
		});
	}

	handleRegister(e) {
		this.setState({
			error: [],
		});

		apiClient.get(process.env.REACT_APP_BACKEND_DOMAIN + '/sanctum/csrf-cookie').then(response => {
			apiClient({
				method: 'POST',
				url: process.env.REACT_APP_BACKEND_DOMAIN + '/api/register',
				headers: {
					Accept: "application/json",
				},
				data: this.state,
			}).then((response) => {
				this.setState({
					error: [],
				});

				alert('The account has already been finished created!\nPlease login!');
				this.props.changeRouteToLoginPage();

			}).catch((error) => {
				if (error.response) {
					var errors = [];

					for (var key in error.response.data.message) {
						error.response.data.message[key].forEach((value) => {
							errors.push(value);
						});
					}

					this.setState({
						error: errors,
					});
				}
			});
		});


		e.preventDefault();
	}


	render() {
		var error;

		if (this.state.error.length !== 0) {
			error = this.state.error.map((value, index) => {
				return (
					<Help
						color="danger"
						key={index}
					>{value}
					</Help>
				);
			});
		}

		return (
			<Columns>
				<Columns.Column size="half" offset="one-quarter">
					<Box
						style={{
							marginTop: "50px",
						}}>

						<Heading>
							Register Page
        				</Heading>

						<form>
							{/* user input part */}
							<Field>
								<Label>Name</Label>
								<Control>
									<Input
										onChange={this.handleChange}
										name="name"
										type="text"
										placeholder="Name"
										color="black"
										value={this.state.name}
									/>
								</Control>
							</Field>

							<Field>
								<Label>Email</Label>
								<Control>
									<Input
										onChange={this.handleChange}
										name="email"
										type="email"
										placeholder="Email"
										color="black"
										value={this.state.email}
									/>
								</Control>
							</Field>

							<Field>
								<Label>Password</Label>
								<Control>
									<Input
										onChange={this.handleChange}
										name="password"
										type="password"
										placeholder="Password"
										color="black"
										value={this.state.password}
									/>
								</Control>
							</Field>

							<Field>
								<Label>Password Confirmation</Label>
								<Control>
									<Input
										onChange={this.handleChange}
										name="password_confirmation"
										type="password"
										placeholder="Password Confirmation"
										color="black"
										value={this.state.password_confirmation}
									/>
								</Control>
								{error}
							</Field>

							<Field>
								<Control>
									<Button
										type="submit"
										color="link"
										onClick={this.handleRegister}
									>Register</Button>
								</Control>
							</Field>
						</form>
					</Box>
				</Columns.Column>
			</Columns>
		);
	}
}


export default App;
