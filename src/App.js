import React, { useState } from 'react';
import { CssBaseline, Container, List, ListItem, ListItemText, CircularProgress, Tabs, Tab } from '@material-ui/core';
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
  const [tabIndex, setTabIndex] = useState(0);

  // Fetch pull requests for the selected repository
  const { loading: prLoading, data: prData } = useQuery(GET_PULL_REQUESTS, {
    variables: {
      owner: selectedRepo?.owner.login,
      name: selectedRepo?.name,
    },
    skip: !selectedRepo, 
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleRepoClick = (repo) => {
    setSelectedRepo(repo); 
  };

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex); // Change active tab
  };

  return (
    <Container>
      <CssBaseline />
      <h1>GitHub Repositories</h1>

      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Tabs to switch views">
        <Tab label="Repositories" />
        <Tab label="Create New Repo" />
      </Tabs>

      {tabIndex === 0 && <List>
        {data.viewer.repositories.nodes.map((repo) => (
          <ListItem button key={repo.name} onClick={() => handleRepoClick(repo)}>
            <ListItemText
              primary={repo.name}
              secondary={repo.description || 'No description available'}
            />
          </ListItem>
        ))}
      </List>}

      {tabIndex === 0 && selectedRepo && (
        <>
          <h2>Pull Requests for {selectedRepo.name}</h2>
          {prLoading ? (
            <CircularProgress />
          ) : (
            <List>
              {prData?.repository?.pullRequests?.nodes?.length > 0 ? (
                prData.repository.pullRequests.nodes.map((pr) => (
                  <ListItem key={pr.title}>
                    <ListItemText
                      primary={pr.title}
                      secondary={`State: ${pr.state} | Created at: ${new Date(pr.createdAt).toLocaleString()}`}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary="No pull requests found"
                    secondary="This repository doesn't have any pull requests."
                  />
                </ListItem>
              )}
            </List>
          )}
        </>
      )}
      { tabIndex === 1 && <CreateRepoForm 
        refetch={refetch}  
        setTabIndex={setTabIndex}
      />}
    </Container>
  );
};

export default App;
