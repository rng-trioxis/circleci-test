import React from 'react';
import {compose} from 'recompose';
import {mount} from 'enzyme';
import {injectContent} from '../injectContent';

jest.mock('react-apollo', () => ({
  ...jest.genMockFromModule('react-apollo'),
  graphql: (query, options) => (WrappedComponent) => (props) =>
    <WrappedComponent {...props} data={{loading: true, content: []}}/>,
  // ApolloClient: jest.fn(),
  // createNetworkInterface: jest.fn(),
  // IntrospectionFragmentMatcher: jest.fn(),
  // toIdValue: jest.fn()
}))

describe('injectContent', () => {
  it('is a function', () => {
    expect(typeof injectContent).toBe('function')
  })

  it('injects the loading prop from react-apollo', () => {
    const fun = jest.fn(props => <div/>);

    const Component = compose(injectContent('derp'))(fun);
    const shal = mount(
      <Component />,
      {context: {trxCMA: {website: 'banana'}}}
    )
    expect(shal).toBeDefined()
    expect(fun.mock.calls[0][0].content).toMatchObject({__loading: true});
  })
})
