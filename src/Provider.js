import React from 'react';
import { ApolloProvider } from 'react-apollo';

import ApolloClient from './ApolloClient';
import {compose,withContext,setPropTypes} from 'recompose';
import PropTypes from 'prop-types';


// Export provider wrapper component
function CMSProvider({children}){
  return (
    <ApolloProvider client={ApolloClient}>
      {children}
    </ApolloProvider>
  );
}

export default compose(
  setPropTypes({
    website:PropTypes.string.isRequired
  }),
  withContext({
    trxCMA:PropTypes.shape({
      website:PropTypes.string.isRequired
    }).isRequired
  },
  props=>({
    trxCMA:{
      website:props.website
    }
  }))
)(CMSProvider)