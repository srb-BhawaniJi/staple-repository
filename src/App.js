import React, { useState } from 'react';
import { CssBaseline, Container, List, ListItem, ListItemText, CircularProgress } from '@material-ui/core';
import { useQuery, gql } from '@apollo/client';
import CreateRepoForm from './CreateRepoForm';

// GraphQL query to fetch repositories
const GET_REPOSITORIES = gql`
  query {
    viewer {
      repositories(first: 10) {
        nodes {
          name
          description
          owner {
            login
          }
        }
      }
    }
  }
`;

// GraphQL query to fetch pull requests for a specific repository
const GET_PULL_REQUESTS = gql`
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      pullRequests(first: 10) {
        nodes {
          title
          state
          createdAt
        }
      }
    }
  }
`;

const App = () => {
  const { loading, error, data , refetch} = useQuery(GET_REPOSITORIES);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repoDetails, setRepoDetails] = useState(null);

  // Fetch pull requests for the selected repository
  const { loading: prLoading, data: prData } = useQuery(GET_PULL_REQUESTS, {
    variables: {
      owner: selectedRepo?.owner.login,
      name: selectedRepo?.name,
    },
    skip: !selectedRepo, // Don't run query until a repo is selected
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleRepoClick = (repo) => {
    setSelectedRepo(repo); // Update selected repo state
  };

  return (
    <Container>
      <CssBaseline />
      <h1>GitHub Repositories</h1>
      <List>
        {data.viewer.repositories.nodes.map((repo) => (
          <ListItem button key={repo.name} onClick={() => handleRepoClick(repo)}>
            <ListItemText
              primary={repo.name}
              secondary={repo.description || 'No description available'}
            />
          </ListItem>
        ))}
      </List>

      {selectedRepo && (
        <>
          <h2>Pull Requests for {selectedRepo.name}</h2>
          {prLoading ? (
            <CircularProgress />
          ) : (
            <List>
              {prData?.repository?.pullRequests?.nodes?.map((pr) => (
                <ListItem key={pr.title}>
                  <ListItemText
                    primary={pr.title}
                    secondary={`State: ${pr.state} | Created at: ${new Date(pr.createdAt).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </>
      )}
      <CreateRepoForm refetch={refetch} />
    </Container>
  );
};

export default App;
