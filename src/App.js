import React, { Component } from 'react';
import axios from 'axios';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const largeColumn = {
  width: '40%',
};
const midColumn = {
  width: '30%',
};
const smallColumn = {
  width: '10%',
};

const SORTS = {
  NONE: list => list,    
  TITLE: list => sortBy(list, 'title'),    
  AUTHOR: list => sortBy(list, 'author'),    
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),    
  POINTS: list => sortBy(list, 'points').reverse(),    
};

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };
    
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }
  
  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }
  
  setSearchTopStories(result) {
    
    //const { hits, page } = result;
    const newHits = result && result.data
      ? result.data.hits
      : [];
    const page = result && result.data
      ? result.data.page
      : 0;
    
    const { searchKey, results } = this.state;
    
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];
      
    const updatedHits = [
      ...oldHits,
      ...newHits
    ];  
      
    this.setState({ 
        results: {
          ...results,
          [searchKey]: { hits: updatedHits, page }
        },
        isLoading: false
    });    
  }
  
  fetchSearchTopStories(searchTerm, page = 0) {
      this.setState({ isLoading: true });
      const url=`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;
      //console.log('fetch url', url);
      //fetch(url)
      axios(url)
      //.then(response => response.json())
      .then(result => {
        if (this._isMounted) {
          this.setSearchTopStories(result)    
        };
      })
      .catch(error => this.setState({ error, isLoading: false }));    
  }
  
  componentDidMount() {
    this._isMounted = true;
      
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }
  
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });    
  }
  
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }
  
  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];      
      
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: { 
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }
    
  render() {
    const { searchTerm, results, searchKey, error, isLoading } = this.state;
    const page = (
      results && 
      results[searchKey] &&
      results[searchKey].page
    ) || 0;
    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];
    return (
      <div className="page">
        <div className="interactions">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        { error 
          ? <div className="interactions">
            <p>Something went wrong!</p>
            { console.log('error:', error) }
          </div>
          : <Table 
            list={list}
            onDismiss={this.onDismiss}
          />
        }
        <div className="interactions">
          { isLoading || error
            ? ''
            : <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1 )}>
              More...
            </Button>
          }
        </div>
      </div>
    );
  }
}

/*
const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>
*/

class Search extends Component {
  
  componentDidMount() {
    if (this.input) {
        this.input.focus();
    }  
  }

  render() {
    const {
      value,
      onChange,
      onSubmit,
      children    
    } = this.props;  
 
    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={el => this.input = el}
        />
        <button type="submit">
          {children}
        </button>
      </form>
    );
  }
   
}
  

class Table extends Component {
  constructor(props) {
    super(props);
      
    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };
  
    this.onSort = this.onSort.bind(this);
  
  }
  
  onSort(sortKey) {
      const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
      this.setState({ sortKey, isSortReverse });
  }

  render() {
    const {
      list,
      onDismiss    
    } = this.props;
    
    const {
      sortKey,
      isSortReverse,
    } = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse
      ? sortedList.reverse()
      : sortedList;

    return (
      <div className="table">
        <div className="table-header">
          <span style={largeColumn}>
            <Sort
              sortKey={'TITLE'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Title
            </Sort>
           </span>
          <span style={midColumn}>
            <Sort
              sortKey={'AUTHOR'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Author
            </Sort>
          </span>
          <span style={smallColumn}>
            <Sort
              sortKey={'COMMENTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Comments
            </Sort>
           </span>
          <span style={smallColumn}>
            <Sort
              sortKey={'POINTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Points
            </Sort>
          </span>
          <span style={smallColumn}>
            Archive
          </span>
        </div>
    
        {reverseSortedList.map(item =>
    
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
            </span>
            <span style={midColumn}>
              {item.author}
            </span>
            <span style={smallColumn}>
              {item.num_comments}
            </span>
            <span style={smallColumn}>
              {item.points}
            </span>
            <span style={smallColumn}>
              <Button 
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
        )}
      </div>
    );
  }  
}  
  
/*
const Table = ({ list, sortKey, isSortReverse, onSort, onDismiss }) => {
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse
    ? sortedList.reverse()
    : sortedList;
  
  return (
      <div className="table">
        <div className="table-header">
          <span style={largeColumn}>
            <Sort
              sortKey={'TITLE'}
              onSort={onSort}
              activeSortKey={sortKey}
            >
              Title
            </Sort>
           </span>
          <span style={midColumn}>
            <Sort
              sortKey={'AUTHOR'}
              onSort={onSort}
              activeSortKey={sortKey}
            >
              Author
            </Sort>
          </span>
          <span style={smallColumn}>
            <Sort
              sortKey={'COMMENTS'}
              onSort={onSort}
              activeSortKey={sortKey}
            >
              Comments
            </Sort>
           </span>
          <span style={smallColumn}>
            <Sort
              sortKey={'POINTS'}
              onSort={onSort}
              activeSortKey={sortKey}
            >
              Points
            </Sort>
          </span>
          <span style={smallColumn}>
            Archive
          </span>
        </div>
    
        {reverseSortedList.map(item =>
    
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
            </span>
            <span style={midColumn}>
              {item.author}
            </span>
            <span style={smallColumn}>
              {item.num_comments}
            </span>
            <span style={smallColumn}>
              {item.points}
            </span>
            <span style={smallColumn}>
              <Button 
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
        )}
      </div>
  );
}
*/

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,    
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,    
};  
  
const Button = ({ onClick, className, children }) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,    
};

Button.defaultProps = {
  className: '',
}
  
const Loading = () =>
  <div>Loading...</div>

const Sort = ({ sortKey, onSort, activeSortKey, children }) =>
  {
    const sortClass = classNames(
      'button-inline',
      { 'button-active': sortKey === activeSortKey }
    );
  
    return (
      <Button 
        onClick={() => onSort(sortKey)}
        className={sortClass}  
      >
        {children}
      </Button>
    );
  }  
  
export default App;

export {
  Button,
  Search,
  Table,
  Loading,
};
