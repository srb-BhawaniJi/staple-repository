// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client'; // Import ApolloProvider
import App from './App'; // Ensure this points to the correct path
import client from './ApolloClient'; // Import the Apollo Client

ReactDOM.render(
  <ApolloProvider client={client}> {/* Wrap the App with ApolloProvider */}
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
