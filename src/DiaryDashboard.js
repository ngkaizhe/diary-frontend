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
import { format, compareAsc } from 'date-fns'

// css files
import './DiaryDashboard.scss';

export const apiClient = axios.create({
    withCredentials: true
});


class DiaryDashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user_token: sessionStorage.getItem('user_token'),
            diaries: [],
            currentViewingIndex: -1,

            // for navbar burger usage
            isActive: false,

            // for creating diary
            create_mode: false,
        };

        this.handleDiarySave = this.handleDiarySave.bind(this);
        this.handleDiaryDelete = this.handleDiaryDelete.bind(this);
        this.handleDiaryAbstractOnClick = this.handleDiaryAbstractOnClick.bind(this);
        this.handleDiaryCreateCancel = this.handleDiaryCreateCancel.bind(this);

        this.handleCreateDiary = this.handleCreateDiary.bind(this);

        this.logout = this.logout.bind(this);
    }

    handleCreateDiary(e) {
        // we just update front end only
        // to store at backend, we will do at this.handleDiarySave part
        if (this.state.create_mode === false) {
            this.setState({
                create_mode: true,
            });

            var diary = {
                id: -1,
                title: '',
                content: '',
                diary_date: format(Date.now(), 'yyyy-MM-dd HH:mm:ss'),
            }
            var diaries = this.state.diaries;
            diaries.push(diary);

            var currentViewingIndex = diaries.length - 1;
            this.setState({
                currentViewingIndex: currentViewingIndex,
            });
        }
        // the user tries to reclick the create diary button
        else {
            alert('Please fill up the title and content of the created diary and save it, before you create another diary!')
        }

        e.preventDefault();
    }

    //#region Handle some function from the children component
    handleDiarySave(diary) {
        var diaries;
        // store
        if (this.state.create_mode) {
            diaries = this.state.diaries;
            diary.diary_date = diaries[diaries.length - 1].diary_date;
            diaries[diaries.length - 1] = diary;

            this.setState({
                diaries: diaries,
            });

            // update backend
            this.storeDiary(diary);
        }

        // update
        else {
            // save the data for frontend cache
            diaries = this.state.diaries;
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

        // we update the currentViewingIndex
        this.setState({
            currentViewingIndex: 0,
        });

        // delete the data for backend
        this.destroyDiaries(diary.id);
    }

    handleDiaryAbstractOnClick(diary_id) {
        // we are in creating mode, 
        // if the user wants to view the other diary,
        // we should tell the user, either save the created diary/cancel creating diary
        if (this.state.create_mode) {
            alert('Please save your created diary or cancel creating diary!');
        }
        else {
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
    }

    handleDiaryCreateCancel() {
        var diaries = this.state.diaries;
        diaries.pop();
        var currentViewingIndex = this.state.currentViewingIndex - 1;
        this.setState({
            diaries: diaries,
            create_mode: false,
            currentViewingIndex: currentViewingIndex,
        });
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
    storeDiary(diary) {
        apiClient({
            method: 'POST',
            url: process.env.REACT_APP_BACKEND_DOMAIN + '/api/diaries',
            headers: {
                Authorization: "Bearer " + this.state.user_token,
                Accept: "application/json",
            },
            data: diary,
        }).then((response) => {
            // update the id values
            var diaries = this.state.diaries;
            var currentViewingIndex = diaries.length - 1;
            diaries[currentViewingIndex].id = response.data.id;

            // update front end
            this.setState({
                diaries: diaries,
                currentViewingIndex: currentViewingIndex,
                create_mode: false,
            });
        }).catch((error) => {
            if (error.response) {
                throw new Error('The status code is ' + error.response.status +
                    '\nThe status text is ' + error.response.statusText
                );
            }
        });
    }

    // update
    updateDiaries(diary) {
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

    // user logout
    logout() {

        apiClient({
            method: 'POST',
            url: process.env.REACT_APP_BACKEND_DOMAIN + '/api/logout',
            headers: {
                Accept: "application/json",
                Authorization: 'Bearer ' + this.state.user_token,
            },
        }).then((response) => {

            // delete session storage value
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('user_token');

            alert('Logout successfully');

            this.props.logout();
        });
    }
    //#endregion

    componentDidMount() {
        this.getDiaries();
    }

    render() {
        // calculate the diary right content key value
        var diaryRightContentKey;
        if (this.state.create_mode) {
            diaryRightContentKey = -1;
        }
        else if (this.state.currentViewingIndex !== -1) {
            diaryRightContentKey = this.state.diaries[this.state.currentViewingIndex].id;
        }
        // default condition, that when refreshing the page, we dont have any diaries content yet
        else {
            diaryRightContentKey = 0;
        }

        // the username
        var username;
        username = sessionStorage.getItem('username');

        return (
            <Box>
                {/* navigation bar */}
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
                        <div className="navbar-start">
                            <a
                                className="navbar-item"
                                onClick={this.handleCreateDiary}
                            >Create Diary</a>
                        </div>
                        <div className="navbar-end">
                            <div className="navbar-item has-dropdown is-hoverable">
                                <div className="navbar-link is-unselectable">
                                    {username}
                                </div>
                                <div className="navbar-dropdown is-boxed">
                                    <a className="navbar-item" onClick={this.logout}>
                                        Logout
          							</a>
                                </div>
                            </div>
                        </div>
                    </div>
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
                        </Tile>

                        <Tile kind="parent" size={6}>
                            {/* right side of main content */}
                            {/* the content of the diary */}
                            <Tile kind="child" notification color="info" size={12}>
                                <DiaryRightContent
                                    diary={this.state.diaries[this.state.currentViewingIndex]}
                                    key={diaryRightContentKey}
                                    handleDiarySave={this.handleDiarySave}
                                    handleDiaryDelete={this.handleDiaryDelete}
                                    handleDiaryCreateCancel={this.handleDiaryCreateCancel}
                                    create_mode={this.state.create_mode}
                                ></DiaryRightContent>
                            </Tile>
                        </Tile>
                    </Tile>
                </Section>
            </Box >
        );
    }
}

export default DiaryDashboard;