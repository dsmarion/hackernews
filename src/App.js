import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

/*
function isSearched(searchTerm) {
  return function (item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}
*/
// same as above with refactoring with arrow function to make more concise
const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      list,
      searchTerm: '',
    }
    
    // autobind
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }
  
  onDismiss(id) {
    /* first try
    const updatedList = this.state.list.filter(function isNotId(item) {
      return item.objectID !== id;    
    });
    */
    
    /* 2nd try - extract the function from the statement
    function isNotId(item) {
        return item.objectID !== id;
    }
    
    const updatedList = this.state.list.filter(isNotId);
    */
    
    /* 3rd try - use arrow function instead of regular function to filter more efficiently
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    */
    
    /* 4th try - inline it all - although it may be less readable */
    const updatedList = this.state.list.filter(item => item.objectID !== id);

    this.setState({ list: updatedList });
  }
  
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });    
  }
    
  render() {
      const { searchTerm, list } = this.state;
      return (
      <div className="App">
        <form>
          <input 
            type="text"
            value={searchTerm}
            onChange={this.onSearchChange}
          />
        </form>
        {list.filter(isSearched(searchTerm)).map(item =>
          <div key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>    
            <span>{item.num_comments}</span>    
            <span>{item.points}</span>
            <span>
              <button
                onClick={() => this.onDismiss(item.objectID)}
                type="button"
              >
                Dismiss
              </button>
            </span>    
          </div>
        )}
      </div>
    );
  }
}

export default App;
