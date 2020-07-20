import React from 'react';
import { render } from '@testing-library/react';
import { App } from './../Components/App';

test("App exists", () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId(/App-test/).textContent).toBeTruthy();
});
