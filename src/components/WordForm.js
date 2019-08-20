import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';

export default class WordForm extends React.Component {
  
  constructor(props) {
    super(props);

		this.state = {
      word: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const word = e.target.value
    this.setState({word})
  }

  handleSubmit(e) {
    e.preventDefault();
    const { word } = this.state;

    this.props.handleWord(word)
    this.setState({word: ""})
  }

  render() {
    const { word } = this.state;

    return (
      <div className="nav">
        <form onSubmit={this.handleSubmit}>
          <TextField type="text" value={word} onChange={this.handleChange} className="word-input" />
          <Button variant="contained" color="primary" type="submit" className="word-button" value="Submit">Submit</Button>
        </form>

        <Button variant="contained" color="secondary"  onClick={this.props.toggleFlashCards}>FlashCards</Button>
      </div>

    )
  }
}