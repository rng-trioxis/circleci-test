import React from 'react';
import {mount} from 'enzyme';

import {injectContent} from '../injectContent';
import * as reactApollo from 'react-apollo';

describe('injectContent', () => {
  it('is a function', () => {
    expect(typeof injectContent).toBe('function')
  })

  it('injects the loading prop from react-apollo', () => {
    const spy = jest.spyOn(reactApollo, 'graphql').mockImplementation(
      (query, options) => (WrappedComponent) => (props) =>
        <WrappedComponent {...props} data={{loading: true, content: []}}/>
    )
    const fun = jest.fn(props => <div/>);
    const Component = injectContent('welcomeText')(fun);
    const mountedComponent = mount(
      <Component />,
      {context: {trxCMA: {website: 'banana'}}}
    );

    expect(mountedComponent).toBeDefined()
    expect(fun).toHaveBeenCalled();
    expect(fun.mock.calls[0][0].content).toMatchObject({__loading: true});

    spy.mockReset();
    spy.mockRestore();
  })

  it('maps returned slugs directly onto the injected content prop', () => {
    const spy = jest.spyOn(reactApollo, 'graphql').mockImplementation(
      (query, options) => (WrappedComponent) => (props) =>
        <WrappedComponent
          {...props}
          data={{
            loading: false,
            content: [{
              id: "d2Vic2l0ZTp3ZWxjb21lVGV4dAo=",
              __typename: "TextContent",
              "website": "banana",
              "slug": "welcome-text",
              "text": "Hi would you like a frozen banana"
            }, {
              id: "d2Vic2l0ZTp3ZWxjb21lVGV4dAo=",
              __typename: "TextContent",
              "website": "banana",
              "slug": "special-offer",
              "text": "Free single-dip banana for family members!"
            }]
          }}
        />
    );
    const fun = jest.fn(props => <div/>);
    const Component = injectContent('welcome-text', "special-offer")(fun);
    const mountedComponent = mount(
      <Component />,
      {context: {trxCMA: {website: 'banana'}}}
    )

    expect(mountedComponent).toBeDefined()
    expect(fun).toHaveBeenCalled();
    expect(fun.mock.calls[0][0].content).toMatchObject({
      __loading: false,
      "welcome-text": "Hi would you like a frozen banana",
      "special-offer": "Free single-dip banana for family members!"
    });

    spy.mockReset();
    spy.mockRestore();
  })
})
