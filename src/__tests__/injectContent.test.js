import React from 'react';
import {mount} from 'enzyme';

import {injectContent} from '../injectContent';
import * as reactApollo from 'react-apollo';

const fixtures = {
  injectedContent: [{
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
}

describe('injectContent', () => {
  it('is a function', () => {
    expect(typeof injectContent).toBe('function')
  })

  it('accepts any number of string arguments and uses apollo graphql to get slugs', () => {
    const spy = jest.spyOn(reactApollo, 'graphql').mockImplementation(
      (query, options) => (WrappedComponent) => (props) =>
        <WrappedComponent
          {...props}
          data={{
            loading: false,
            content: [fixtures.injectedContent[0], fixtures.injectedContent[1]]
          }}
        />
    );
    const fun = jest.fn(props => <div/>);
    const Component = injectContent('welcome-text', "special-offer")(fun);
    const mountedComponent = mount(
      <Component />,
      {context: {trxCMA: {website: 'banana'}}}
    )

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][1].options({trxCMA: {website: 'banana'}})).toHaveProperty(
      'variables.slugs',
      [
        {slug: "welcome-text", website: "banana"},
        {slug: "special-offer", website: "banana"}
      ]
    )

    spy.mockReset();
    spy.mockRestore();
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
            content: [fixtures.injectedContent[0], fixtures.injectedContent[1]]
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
