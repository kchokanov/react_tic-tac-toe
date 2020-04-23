import React from 'react';
import Board from '../components/Board';

import {configure, shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Square from '../components/Square';
configure({adapter: new Adapter()});


describe('Board Component Suite', () => {
  it('renders 3 containers to act as rows', () => {
    const wrapper = shallow(<Board/>);

    expect(wrapper.find('.board-row').length).toBe(3);
  });

  it('displays a static text for turn order', () => {
    const wrapper = shallow(<Board/>);

    expect(wrapper.find('.status').text()).toBe('Next player: X');
  });

  it('renders 3 row containers with 3 squares in each container', () => {
    const wrapper = shallow(<Board/>);

    wrapper.find('.board-row').forEach((row) => {
      expect(row.children().length).toBe(3);
      row.children().forEach(function(node) {
        expect(node.type()).toEqual(Square);
      });
    });
  });

  it('initializes a default state when mounted', () => {
    const wrapper = shallow(<Board/>);
    expect(wrapper.state('squares')).toEqual(Array(9).fill(null));
    expect(wrapper.state('xIsNext')).toEqual(true);
  });

  it('passes a array value from the state to the corresponding square ' +
    'as a value prop', () => {
    const wrapper = mount(<Board/>);
    const testState = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    const res = [];
    wrapper.setState({squares: testState});
    wrapper.find('.board-row').forEach((row) => {
      row.children().forEach(function(node) {
        res.push(node.props().value);
      });
    });
    expect(res).toEqual(testState);
  });
  it('passes an onclick handler function to all child squares', () => {
    const spy = jest.spyOn(Board.prototype, 'handleClick');
    const wrapper = mount(<Board/>);
    wrapper.find('.board-row').forEach((row) => {
      row.children().forEach(function(node) {
        node.simulate('click');
      });
    });
    expect(spy).toBeCalledTimes(9);
    spy.mockClear();
  });

  it('updates the child square with the turn players symbol ' +
    'when clicked on and then updates the current player bool', () => {
    const valRes = [];
    const expValRes = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
    const xIsNextRes = [];
    const expXIsNextRes = [true, false, true, false, true, false, true, false,
      true];
    const wrapper = mount(<Board/>);

    wrapper.find('.board-row').forEach((row) => {
      row.children().forEach(function(node) {
        xIsNextRes.push(wrapper.state('xIsNext'));
        node.simulate('click');
      });
    });

    /* loop around a second time to get the props because they don't update
       in time for some reason. */
    wrapper.find('.board-row').forEach((row) => {
      row.children().forEach(function(node) {
        valRes.push(node.props().value);
      });
    });
    expect(valRes).toEqual(expValRes);
    expect(xIsNextRes).toEqual(expXIsNextRes);
  });
});
