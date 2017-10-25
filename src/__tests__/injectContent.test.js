import React from 'react';
import {mount} from 'enzyme';

import {injectContent} from '../injectContent';
import * as reactApollo from 'react-apollo';

const fixtures = {
  context: {
    trxCMA: {
      website: 'banana'
    }
  },
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

  it('accepts a string argument and uses apollo graphql to get the slug', () => {
    const spy = jest.spyOn(reactApollo, 'graphql').mockImplementation(
      (query, config) => (WrappedComponent) => (props) =>
        <WrappedComponent
          {...props}
          data={{
            loading: false,
            content: [fixtures.injectedContent[0], fixtures.injectedContent[1]]
          }}
        />
    );
    const child = jest.fn(props => <div/>);
    const Component = injectContent('welcome-text')(child);
    const mountedComponent = mount(
      <Component />,
      {context: fixtures.context}
    )

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][1].options(fixtures.context)).toHaveProperty(
      'variables.slugs',
      [{ slug: "welcome-text", website: "banana" }]
    )

    spy.mockReset();
    spy.mockRestore();
  })

  it('accepts any number of string arguments and uses apollo graphql to get slugs', () => {
    const spy = jest.spyOn(reactApollo, 'graphql').mockImplementation(
      (query, config) => (WrappedComponent) => (props) =>
        <WrappedComponent
          {...props}
          data={{
            loading: false,
            content: [fixtures.injectedContent[2], fixtures.injectedContent[1]]
          }}
        />
    );
    const child = jest.fn(props => <div/>);
    const Component = injectContent('welcome-text', "special-offer")(child);
    const mountedComponent = mount(
      <Component />,
      {context: fixtures.context}
    )

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][1].options(fixtures.context)).toHaveProperty(
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
      (query, config) => (WrappedComponent) => (props) =>
        <WrappedComponent {...props} data={{loading: true, content: []}}/>
    )
    const child = jest.fn(props => <div/>);
    const Component = injectContent('welcomeText')(child);
    const mountedComponent = mount(
      <Component />,
      {context: fixtures.context}
    );

    expect(mountedComponent).toBeDefined()
    expect(child).toHaveBeenCalled();
    expect(child.mock.calls[0][0].content).toMatchObject({__loading: true});

    spy.mockReset();
    spy.mockRestore();
  })

  it('maps returned slugs directly onto the injected content prop', () => {
    const spy = jest.spyOn(reactApollo, 'graphql').mockImplementation(
      (query, config) => (WrappedComponent) => (props) =>
        <WrappedComponent
          {...props}
          data={{
            loading: false,
            content: [fixtures.injectedContent[0], fixtures.injectedContent[1]]
          }}
        />
    );
    const child = jest.fn(props => <div/>);
    const Component = injectContent('welcome-text', "special-offer")(child);
    const mountedComponent = mount(
      <Component />,
      {context: fixtures.context}
    )

    expect(mountedComponent).toBeDefined()
    expect(child).toHaveBeenCalled();
    expect(child.mock.calls[0][0].content).toMatchObject({
      __loading: false,
      "welcome-text": "Hi would you like a frozen banana",
      "special-offer": "Free single-dip banana for family members!"
    });

    spy.mockReset();
    spy.mockRestore();
  })

  it('can take a single functional argument that recieves props and returns an array of strings to query', () => {
    const spy = jest.spyOn(reactApollo, 'graphql').mockImplementation(
      (query, config) => (WrappedComponent) => (props) => {
        // react-apollo.graphql uses the options config object
        config.options(props);
        return <WrappedComponent
          {...props}
          data={{
            loading: false,
            content: [fixtures.injectedContent[0], fixtures.injectedContent[1]]
          }}
        />
      }
    );

    const child = jest.fn(props => <div/>);
    const slugFunc = jest.fn(props => [
      'welcome-text',
      props.offerAvailable ? 'offer-available' : 'offer-expired'
    ])
    const Component = injectContent(slugFunc)(child);
    const mountedComponent = mount(
      <Component offerAvailable={false} />,
      {context: fixtures.context}
    )

    expect(spy).toHaveBeenCalled();
    expect(slugFunc).toHaveBeenCalledWith(
      expect.objectContaining({offerAvailable: false})
    )
    expect(spy.mock.calls[0][1].options(fixtures.context)).toHaveProperty(
      'variables.slugs',
      [
        {slug: "welcome-text", website: "banana"},
        {slug: "offer-expired", website: "banana"}
      ]
    )
    expect(child).toHaveBeenCalledWith(expect.objectContaining({
      offerAvailable: false
    }))

    spy.mockReset();
    spy.mockRestore();
  })
})
