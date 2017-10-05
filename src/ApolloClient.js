import {
  ApolloClient,
  createNetworkInterface,
  IntrospectionFragmentMatcher,
  toIdValue
} from 'react-apollo';

const networkInterface = createNetworkInterface({
  uri: 'https://api.cms.cafe/graphql'
});

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: "INTERFACE",
          name: "Content",
          possibleTypes: [
            { name: "TextContent" },
            { name: "ContentCollection" },
            { name: "JSONContent" },
          ],
        },
      ],
    },
  }
})

const customResolvers = {
  Query: {
    content: (res, args) => {
      const graphqlResults = Object.values(res).reduce((acc,curr)=>curr.concat(acc), []);

      const result = graphqlResults
      .map(client.dataIdFromObject)
      .map(toIdValue)

      return result;
    },
  },
};

// const dataIdFromObject = o => o.id;
const dataIdFromObject = o => `${o.website}:${o.slug}`;

const client = new ApolloClient({
  networkInterface: networkInterface,
  connectToDevTools: true,
  fragmentMatcher,
  customResolvers,
  dataIdFromObject
});

export default client;
