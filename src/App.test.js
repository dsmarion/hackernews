import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, { Search, Button, Table, Loading } from './App';

Enzyme.configure({ adapter: new Adapter() });

describe('App', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  
  test('has a valid snapshot', () => {
    const component = renderer.create(
      <App />  
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();    
  });
  
    
});


describe('Search', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Search>Search</Search>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  
  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Search>Search</Search>  
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();    
  });
  
    
});


describe('Button', () => {

  const props = {
    onClick: function() {},    
  };
    
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button { ...props }>Click Me</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  
  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Button { ...props }>Click Me</Button>  
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();    
  });
  
  it('shows a button element', () => {
    const element = shallow(
      <Button { ...props }>Click Me</Button>
    );    
  });
  
    
});


describe('Table', () => {
    
  const props = {
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 'z' },
    ],
    sortKey: 'TITLE',
    isSortReverse: false,
    onDismiss: function() {},    
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Table { ...props } />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  
  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Table { ...props } />  
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();    
  });
  
  it('shows two items in list', () => {
    const element = shallow(
      <Table { ...props } />
    );
    
    expect(element.find('.table-row').length).toBe(2);    
  });
  
    
});


describe('Loading', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Loading />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

});