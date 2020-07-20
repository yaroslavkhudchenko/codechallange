import React from 'react';
import { Search } from '../Components/Search';
import { act } from "react-dom/test-utils";
import { render, fireEvent, cleanup, waitForElement, queryByTestId } from '@testing-library/react';

afterEach(cleanup);

describe('Search component : ',() => {

    test("rendered", () => {

        const { container } = render(<Search />);

        expect(container).toBeTruthy()

    });


    test("focused on the input", () => {

        const { queryByTestId } = render(<Search />);

        let searchInput = queryByTestId('search-input-test');
        expect(searchInput).toEqual(document.activeElement);
        
    });

    test('results should be empty from the beginnig:', () => {
        const { queryByTestId } = render(<Search />);
        
        let resultsDiv = queryByTestId('search-results-test');
        expect(resultsDiv.textContent).toBe('No search result');
    })

    test('search input must contain at least 3 chars to trigger search', async() => {


        const { queryByTestId, queryByPlaceholderText } = render(<Search />);

        const searchInput = queryByPlaceholderText('Type name to search');

        // change input to 2 chars
        fireEvent.change(searchInput, { target: { value: "aa" }})
        expect(searchInput.value).toBe('aa')

        let loader = queryByTestId('loader-test');
       
        expect(loader).toBeFalsy(); // loader should not be visible because no call

        // change input to 3 chars
        fireEvent.change(searchInput, { target: { value: "aaa" }})

        expect(searchInput.value).toBe('aaa')
        loader = queryByTestId('loader-test');
       
        expect(loader).toBeTruthy() // should be visible because 3 chars

        
    });

    test('if delete chars to 2 or less resets resultsDiv', () => {

        const { queryByTestId, queryByPlaceholderText } = render(<Search />);
        const searchInput = queryByPlaceholderText('Type name to search');

        // change input to 1 char
        fireEvent.change(searchInput, { target: { value: "a" }})
        let loader = queryByTestId('loader-test');

        expect(loader).toBeFalsy(); // no loader

        let resultsDiv = queryByTestId('search-results-test');
        expect(resultsDiv.textContent).toBe('No search result');

    })

    describe('keybord strokes: ', () => {
        
      
        test('keydown arrow up -> select previous element in the list',() => {
            const { queryByTestId } = render(<Search />);

            const resultsDiv = queryByTestId('search-results-test');
            resultsDiv.innerHTML = `
                <a href="https://github.com/kentonv/dvorak-qwerty" target="_blank" rel="noopener noreferrer" class="singleResult" tabindex="-1">
                    <div class="resultName">1: dvorak-qwerty</div></a>
                <a href="https://github.com/bibiqqqq/imooc-react-chat" target="_blank" rel="noopener noreferrer" class="singleResult" tabindex="-1">
                <div class="resultName">2: imooc-react-chat</div></a>`;

            // two keys down to second result
            act(() => document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 40, 'key':'ArrowDown'})));
            act(() => document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 40, 'key':'ArrowDown'})));

          
            let firstResult = document.querySelectorAll('.singleResult')[0];
            let secondResult = document.querySelectorAll('.singleResult')[1];


            expect(secondResult).toBe(document.activeElement)

            // up once to first result
            act(() => document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 38, 'key':'ArrowUp'})));

            expect(firstResult).toBe(document.activeElement)
           
            // up once to input
            act(() => document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 38, 'key':'ArrowUp'})));

            let searchInput = queryByTestId('search-input-test');
            expect(searchInput).toBe(document.activeElement)

        })

        test('keydown arrow down -> select next element in the list',() => {
            const { queryByTestId } = render(<Search />);

            const resultsDiv = queryByTestId('search-results-test');
            resultsDiv.innerHTML = `
                <a href="https://github.com/kentonv/dvorak-qwerty" target="_blank" rel="noopener noreferrer" class="singleResult" tabindex="-1">
                    <div class="resultName">1: dvorak-qwerty</div></a>
                <a href="https://github.com/bibiqqqq/imooc-react-chat" target="_blank" rel="noopener noreferrer" class="singleResult" tabindex="-1">
                <div class="resultName">2: imooc-react-chat</div></a>`;
            //console.log(document.querySelectorAll('.singleResult'))

            let focusedElement = document.activeElement;
    
            act(() => document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 40, 'key':'ArrowDown'})));

          
            let firstResult = document.querySelectorAll('.singleResult')[0];
            let secondResult = document.querySelectorAll('.singleResult')[1];

            expect(firstResult).toBe(document.activeElement)

            act(() => document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode': 40, 'key':'ArrowDown'})));

            expect(secondResult).toBe(document.activeElement)

        })
    })
})