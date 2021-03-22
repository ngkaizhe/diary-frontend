// react modules
import React from 'react';
import axios from 'axios';

// bulma modules
import Section from 'react-bulma-components/lib/components/section';
import Tile from 'react-bulma-components/lib/components/tile';
import Navbar from 'react-bulma-components/lib/components/navbar';
import Box from 'react-bulma-components/lib/components/box';

// my own modules
import DiaryLeftContent from './DiaryLeftContent';
import DiaryRightContent from './DiaryRightContent';

// date format changing
import { compareAsc } from 'date-fns'

// css files
import './App.scss';

const apiClient = axios.create({
	withCredentials: true
});


class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user_token: '1|nB8uQJEW3p9u0eH94ucgWTTHy5YvJXwmv5B5nEKK',
			diaries: [],
			currentViewingIndex: -1,
		};

		this.handleDiarySave = this.handleDiarySave.bind(this);
		this.handleDiaryDelete = this.handleDiaryDelete.bind(this);
		this.handleDiaryAbstractOnClick = this.handleDiaryAbstractOnClick.bind(this);
	}

	//#region Handle some function from the children component
	handleDiarySave(diary) {
		// save the data for frontend cache
		var diaries = this.state.diaries;
		diaries.forEach((element) => {
			if (element.id === diary.id) {
				element.title = diary.title;
				element.content = diary.content;
				diary = element;
			}
		});

		this.setState({
			diaries: diaries,
		});

		// save the data for backend
		this.updateDiaries(diary);
	}

	handleDiaryDelete(diary) {
		// delete the data for frontend cache
		var diaries = this.state.diaries;
		diaries = diaries.filter((item) => {
			return item.id !== diary.id;
		});

		this.setState({
			diaries: diaries,
		});

		// we update the currentViewingID
		this.setState({
			currentViewingIndex: 0,
		});

		// delete the data for backend
		this.destroyDiaries(diary.id);
	}

	handleDiaryAbstractOnClick(diary_id) {
		var currentViewingIndex = -1;
		// eslint-disable-next-line
		var find = this.state.diaries.some((element, index) => {
			if (element.id === diary_id) {
				currentViewingIndex = index;
				return true;
			}
		});

		if (find) {
			// the diary from left view was clicked, we change the diary right content view
			this.setState({
				currentViewingIndex: currentViewingIndex,
			});
		}
		else {
			throw new Error('Something went wrong, the diary id passed from children component could not find!');
		}
	}
	//#endregion

	//#region backend approaches
	// index
	// get diaries from back end 
	getDiaries() {
		var diaries;

		apiClient({
			method: 'GET',
			url: process.env.REACT_APP_BACKEND_DOMAIN + '/api/diaries',
			headers: {
				Authorization: "Bearer " + this.state.user_token,
				Accept: "application/json",
			},
		})
			.then((response) => {
				diaries = response.data.diaries;
				// resort
				diaries.sort(
					(diary1, diary2) => {
						var date1 = new Date(diary1.diary_date);
						var date2 = new Date(diary2.diary_date);

						return compareAsc(date1, date2);
					}
				);
				this.setState({
					diaries: diaries,
					currentViewingIndex: 0,
				});
			}).catch((error) => {
				if (error.response) {
					throw new Error('The status code is ' + error.response.status +
						'\nThe status text is ' + error.response.statusText
					);
				}

			});
	}

	// store
	storeDiaries(diary) {
		// fetch data from backend
		// header
		var myHeaders = new Headers();
		myHeaders.append(
			"Authorization", "Bearer " + this.state.user_token
		);
		myHeaders.append(
			"Accept", "application/json"
		);

		// form data
		var formdata = new FormData();
		formdata.append("title", diary.title);
		formdata.append("diary_date", diary.diary_date);
		formdata.append("content", diary.content);

		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: formdata,
		};

		fetch(process.env.REACT_APP_BACKEND_DOMAIN + "/api/diaries", requestOptions)
			.then((response) => {
				if (response.ok) {
					return response.text();
				}
				else {
					throw new Error('Something went wrong, the status code is not 200');
				}
			})
			.catch(error => console.log('Error', error));
	}

	// update
	updateDiaries(diary) {
		if (false) {
			apiClient.get(process.env.REACT_APP_BACKEND_DOMAIN + '/sanctum/csrf-cookie')
				.then(response => {

				});
		}

		apiClient({
			method: 'post',
			url: process.env.REACT_APP_BACKEND_DOMAIN + '/api/diaries/' + diary.id,
			data: {
				title: diary.title,
				content: diary.content,
				diary_date: diary.diary_date,
				_method: 'PUT',
			},
			headers: {
				Authorization: "Bearer " + this.state.user_token,
				Accept: "application/json",
			},
		}).catch((error) => {
			if (error.response) {
				throw new Error('The status code is ' + error.response.status +
					'\nThe status text is ' + error.response.statusText
				);
			}
		});
	}

	// destroy
	destroyDiaries(diaries_id) {
		apiClient({
			method: 'post',
			url: process.env.REACT_APP_BACKEND_DOMAIN + '/api/diaries/' + diaries_id,
			data: {
				_method: 'DELETE',
			},
			headers: {
				Authorization: "Bearer " + this.state.user_token,
				Accept: "application/json",
			},
		}).catch((error) => {
			if (error.response) {
				throw new Error('The status code is ' + error.response.status +
					'\nThe status text is ' + error.response.statusText
				);
			}
		});
	}

	//#endregion

	componentDidMount() {
		this.getDiaries();
	}

	render() {
		return (
			<Box>
				{/* navigation bar */}
				<Navbar color="dark">
					<Navbar.Brand>
						<Navbar.Item renderAs="a" href="#">
							My Diary
						</Navbar.Item>
						<Navbar.Burger />
					</Navbar.Brand>
					<Navbar.Menu>
						<Navbar.Container position="end">
							<Navbar.Item dropdown hoverable href="#">
								<Navbar.Link>
									Name of current person
							  </Navbar.Link>
								<Navbar.Dropdown>
									<Navbar.Item href="#">
										Logout
								</Navbar.Item>
								</Navbar.Dropdown>
							</Navbar.Item>
						</Navbar.Container>
					</Navbar.Menu>
				</Navbar>

				<Section>
					<Tile kind="ancestor">
						<Tile kind="parent" size={6}>
							{/* left side of main content */}
							<Tile kind="child" notification color="primary" size={12}>
								<DiaryLeftContent
									handleDiaryAbstractOnClick={this.handleDiaryAbstractOnClick}
									diaries={this.state.diaries}
								></DiaryLeftContent>
							</Tile>
							{/* some basic options (add new diary) */}
							{/* list of date */}
						</Tile>

						<Tile kind="parent" size={6}>
							{/* right side of main content */}
							{/* the content of the diary */}
							<Tile kind="child" notification color="info" size={12}>
								<DiaryRightContent
									diary={this.state.diaries[this.state.currentViewingIndex]}
									key={this.state.currentViewingIndex !== -1 ? this.state.diaries[this.state.currentViewingIndex].id : 0}
									handleDiarySave={this.handleDiarySave}
									handleDiaryDelete={this.handleDiaryDelete}
								></DiaryRightContent>
							</Tile>
						</Tile>
					</Tile>
				</Section>
			</Box>

		);
	}

}

export default App;
