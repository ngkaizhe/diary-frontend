import React from 'react';

import Button from 'react-bulma-components/lib/components/button';
import Heading from 'react-bulma-components/lib/components/heading';
import Section from 'react-bulma-components/lib/components/section';
import Tile from 'react-bulma-components/lib/components/tile';
import Navbar from 'react-bulma-components/lib/components/navbar';
import Box from 'react-bulma-components/lib/components/box';
import { Field, Control, Label, Input, Textarea } from 'react-bulma-components/lib/components/form';

import './App.scss';


class DiaryContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			diary_title: 'The title of the diary',
			diary_content: 'Self Internal Thoughts\nYesterday night, I cant really sleep well. I go to bed around 0000, cant sleep and just lying on the bed until 0130.\n\nFor the time of 1 hour and 30 minutes, I was thinking my previous relationship with Felicia. The things that I had been doing wrong, the happiness I get when I was in that relationship, how cute is she when I looked her in her eyes. That period of time is really sweet for me, I think that I am the luckiest man in the world. She is really beatiful, mature, shy, cute. I was also thinking of how bad, laziness I am, when we are in the relationship, she didn\'t even feel a single afraid of the future between us, but what I have done is just being a coward. A coward that scared to handle the relationship, scared to face the problems that brought from the relationship, scared to the one to be responsible for the relationship. I promised myself, I will be brave to solve all of those problems.\n\n\n\nAt the evening, I have a conversation with my parents. It is so ashame for me, I just keep saying that I need to do my homework, in order to end the conversation as fast as possible. My father, mother and me have a talk about the dental fee problems, and we have the conclusion, that if the dental fee is quite high, then I must have to note them before I have any futher actions. How funny that I just keep ignoring the suggestion from them. I really feel sorry for them, but I just don\'t want to say that through the phone, I will go to do that when I reach home. When face to face, I will be good to them to overcome those damage that I made to them because of my childishness.',
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	handleChange(evt) {
		const value = evt.target.value;
		this.setState({
			[evt.target.name]: value,
		});
	}

	handleSave(event) {
		console.log('Diary Title is: ' + this.state.diary_title);
		// save the diary data to the back end
		event.preventDefault();
	}

	handleCancel(event) {
		console.log('Diary Title is: ' + this.state.diary_title);
		// redirect back to dashboard
		event.preventDefault();
	}

	render() {
		return (
			<>
				<Field>
					<Label>Title</Label>
					<Control>
						<Input
							onChange={this.handleChange}
							name="diary_title"
							value={this.state.diary_title} />
					</Control>
				</Field>

				<Field>
					<Label>Content</Label>
					<Control>
						<Textarea
							rows="20"
							onChange={this.handleChange}
							name="diary_content"
							value={this.state.diary_content} />
					</Control>
				</Field>

				<Field kind="group">
					<Control>
						<Button type="primary" onClick={this.handleSave}>Save</Button>
					</Control>
					<Control>
						<Button color="link" onClick={this.handleCancel}>Cancel</Button>
					</Control>
				</Field>
			</>

		);

	}
}


function App() {
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
					<Tile kind="parent">
						{/* left side of main content */}
						<Tile renderAs="article" kind="child" notification color="primary" >
							<Heading>Left Tile</Heading>
						</Tile>
						{/* some basic options (add new diary) */}
						{/* list of date */}
					</Tile>

					<Tile kind="parent">
						{/* right side of main content */}
						{/* the content of the diary */}
						<Tile kind="child" notification color="info" >
							<DiaryContent></DiaryContent>
						</Tile>
					</Tile>
				</Tile>

			</Section>

		</Box>

	);
}

export default App;
