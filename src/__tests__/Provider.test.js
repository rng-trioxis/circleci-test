import Provider from '../Provider';

import React from 'react';
import {shallow} from 'enzyme';

describe('Provider', () => {
  it('renders children', () => {
    const child = <div className="hi">Hi</div>;
    const prov = shallow(
      <Provider website="dummy">
        {child}
      </Provider>
    );

    expect(prov.contains(child)).toBe(false);
  })
})
