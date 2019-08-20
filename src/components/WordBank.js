import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Button from '@material-ui/core/Button';

import WordForm from './WordForm'
import WordList from './WordList'
import Loading from './Loading'

export default class WordBank extends React.Component {
  constructor(props) {
    super(props);

		this.state = {
      words: {},
      isLoading: false,
      showFlashCards: false
    };
    this.handleWord = this.handleWord.bind(this);
    this.fetchDefinition = this.fetchDefinition.bind(this);
    this.toggleFlashCards = this.toggleFlashCards.bind(this);
  }

  fetchDefinition(word) {
    this.setState({isLoading: true})
    const self = this
    const { words } = this.state;

    axios.get(`https://kettle-assess.glitch.me/definition?word=${word}`)
    .then(function ({data: {definition}}) {
      const dict = {} 
      const firstDef = definition.split(/\n/)[1]
      console.log("firstDef", firstDef)

      let open = 0 
      let close = 0 
      let nextParens = false
      let realDef = ""
      for (var i = 0; i < firstDef.length; i++) {
        if (firstDef.charAt(i) == "("){
          open = open + 1
        }

        if (nextParens && open > close) {
          if (!(firstDef.charAt(i) == "(" || firstDef.charAt(i) == ")")){
            realDef =  realDef + firstDef.charAt(i)
          }
        }

        if (firstDef.charAt(i) == ")"){
          close = close + 1

          // after the first set look for the next closing
          if (open === 1 && open === close) {
            console.log("next")
            nextParens = true
          }
        }
      }

      dict[word] = realDef

      self.setState({
        words: Object.assign(words, dict)
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(() => {
      self.setState({
        isLoading: false
      });
    })
  }

  handleWord(word) {
    const { words } = this.state
    const that = this
    if (word.toLowerCase() in words){
      return //maybe add a error
    }else{
     this.fetchDefinition(word)
    }
  }

  toggleFlashCards() {
    this.setState(prevState => ({
      showFlashCards: !prevState.showFlashCards
    }));
  }

  render() {
    const { words, isLoading, showFlashCards } = this.state;
    return (
      <Fragment>
        <WordForm handleWord={this.handleWord} toggleFlashCards={this.toggleFlashCards} />
        {showFlashCards && <Cards words={words} toggleFlashCards={this.toggleFlashCards} />}
        <Loading isLoading={isLoading} />
        <WordList words={words} />
      </Fragment>
    )
  }
}

class Cards extends React.Component {
  constructor(props) {
    super(props);
    
		this.state = {
      words: [],
      scrambled: [[], []],
      showWord: false
    };

    this.scramble = this.scramble.bind(this);
    this.flipCard = this.flipCard.bind(this);
    this.nextCard = this.nextCard.bind(this);
  }

  scramble() {
    const { words } = this.props;
    const scrambled = [[], []];
    
    const keys = Object.keys(words)
    for (let i = keys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    
    keys.forEach((key) => {
      scrambled[0].push(key)
      scrambled[1].push(words[key])
    })

    this.setState({
      scrambled,
    })
  }

  nextCard() {
    const {scrambled} = this.state
    console.log(scrambled.length)
    if (scrambled[0].length === 1) {
      this.scramble();
    } else {
    // Remove from list
      const newScrambled = [
        [...scrambled[0].slice(0, 0), ...scrambled[0].slice(0 + 1)],
        [...scrambled[1].slice(0, 0), ...scrambled[1].slice(0 + 1)]
      ]

      this.setState(prevState => ({
        index: prevState.index + 1,
        scrambled: newScrambled
      }));
    }

  }

  flipCard() {
    this.setState(prevState => ({
      showWord: !prevState.showWord
    }));
  }

  componentDidMount() {
    this.scramble();
  }

  render() {
    const {showWord, scrambled} = this.state
    console.log(showWord)
    console.log(scrambled)
    return (
      <div className="overlay">
        <Button color="secondary" onClick={this.props.toggleFlashCards}>
          Close
        </Button>

        <Button color="primary" onClick={this.flipCard}>
          Flip
        </Button>


        <Button color="default" onClick={this.nextCard}>
          Next
        </Button>

        <div className={showWord ? 'definition hide' : 'definition'}>
          <h1>Definition</h1>
          <h2>{scrambled[1][0]}</h2>
        </div>

        <div className={!showWord ? 'word hide' : 'word'}>
          <h1>{scrambled[0][0]}</h1>
        </div>

      </div>
    )
  }
}