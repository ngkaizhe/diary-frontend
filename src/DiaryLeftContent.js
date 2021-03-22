import React from 'react';
// bulma modules
import Content from 'react-bulma-components/lib/components/content';
import Box from 'react-bulma-components/lib/components/box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
// date format changing
import { format } from 'date-fns'

class DiaryLeftContent extends React.Component {
    render() {
        // the value passed from the parent has been updated
        var diaries = this.props.diaries;

        var diariesRendered = [];
        var previousMonthDesc = 'underfine';

        diaries.forEach((diary) => {
            const monthDesc = format(new Date(diary.diary_date), 'MMMM, yyyy');
            // new month
            if (previousMonthDesc === 'underfine' || previousMonthDesc !== monthDesc) {
                var element = {
                    monthDesc: monthDesc,
                    diariesMonthly: [
                        {
                            date: format(new Date(diary.diary_date), 'dd'),
                            title: diary.title,
                            id: diary.id,
                        }
                    ],
                };
                diariesRendered.push(element)
                previousMonthDesc = monthDesc
            }
            // previous month
            else {
                var diaryMonthly = {
                    date: format(new Date(diary.diary_date), 'dd'),
                    title: diary.title,
                    id: diary.id,
                };
                diariesRendered[diariesRendered.length - 1].diariesMonthly.push(diaryMonthly);
            }
        });

        diariesRendered = diariesRendered.map((diary, index) => {
            return (
                <DiaryAbstractView
                    handleDiaryAbstractOnClick={this.props.handleDiaryAbstractOnClick}
                    value={diary}
                    key={index}>
                </DiaryAbstractView>
            );
        })


        return (
            diariesRendered
        );
    }
}

class DiaryAbstractView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpand: false,
        };

        this.handleExpandOnClick = this.handleExpandOnClick.bind(this);
    }

    handleExpandOnClick() {
        const isExpand = !this.state.isExpand;
        this.setState({
            isExpand: isExpand,
        });
    }

    handleDiaryAbstractOnClick(diaries_id) {
        this.props.handleDiaryAbstractOnClick(diaries_id);
    }

    render() {
        const diaries = this.props.value.diariesMonthly;

        const diariesRendered = diaries.map((element, index) => {
            return (
                <dd key={index}>
                    <div
                        onClick={this.handleDiaryAbstractOnClick.bind(this, element.id)}
                        style={{
                            cursor: "pointer",
                            display: "block",
                            userSelect: "none",
                        }}>
                        <span style={{
                            borderStyle: "solid",
                            paddingRight: "5px",
                        }}>
                            {element.date}
                        </span>
                        <span style={{
                            borderStyle: "solid",
                            padding: "0px 5px 0px 5px"
                        }}>
                            {element.title}
                        </span>
                    </div>
                </dd>
            );
        });

        return (
            <Box>
                <Content>
                    <dl>
                        <dt>
                            <div
                                style={{
                                    cursor: "pointer",
                                    display: "block",
                                    borderStyle: "solid",
                                    userSelect: "none",
                                }}
                                onClick={this.handleExpandOnClick}
                            >
                                <FontAwesomeIcon icon={this.state.isExpand ? faAngleUp : faAngleDown} />
                                <span style={{
                                    paddingLeft: "5px",
                                }}>{this.props.value.monthDesc}</span>
                            </div>
                        </dt>
                        {this.state.isExpand && diariesRendered}
                    </dl>
                </Content>
            </Box>
        );
    }
}

export default DiaryLeftContent;