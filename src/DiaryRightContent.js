// react modules
import React from 'react';

import Button from 'react-bulma-components/lib/components/button';
import { Field, Control, Label, Input, Textarea } from 'react-bulma-components/lib/components/form';

class DiaryRightContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: -1,
            title: '',
            content: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({
            [evt.target.name]: value,
        });
    }

    handleSave(event) {
        const diary = this.state;
        // pass the "save diary data" event to the parent component
        this.props.handleDiarySave(diary);

        event.preventDefault();
    }

    componentDidMount() {
        // the diary waasn't undefined
        if (this.props.diary) {
            this.setState({
                id: this.props.diary.id,
                title: this.props.diary.title,
                content: this.props.diary.content,
            });
        }
    }

    render() {
        return (
            <>
                <Field>
                    <Label>Title</Label>
                    <Control>
                        <Input
                            onChange={this.handleChange}
                            name="title"
                            value={this.state.title} />
                    </Control>
                </Field>

                <Field>
                    <Label>Content</Label>
                    <Control>
                        <Textarea
                            rows={20}
                            onChange={this.handleChange}
                            name="content"
                            value={this.state.content} />
                    </Control>
                </Field>

                <Field kind="group">
                    <Control>
                        <Button type="primary" onClick={this.handleSave}>Save</Button>
                    </Control>
                </Field>
            </>
        );
    }
}

export default DiaryRightContent;