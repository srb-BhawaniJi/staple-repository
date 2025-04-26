import React, { useState } from 'react';
import { Container, List, ListItem, ListItemText, CircularProgress, Tabs, Tab, Box, Button, Snackbar } from '@mui/material';
import { useQuery, gql } from '@apollo/client';
import CreateRepoForm from './CreateRepoForm';

// GraphQL query to fetch repositories
const GET_REPOSITORIES = gql`
  query {
    viewer {
      repositories(first: 20) {
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
  const [tabIndex, setTabIndex] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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
    setTabIndex(newTabIndex); 
  };

  const goBack = () => {
    setSelectedRepo(null);
    setTabIndex(0)
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    if(snackbarSeverity === 'success'){
      refetch();
      setTabIndex(0);
    }
  };

  return (
    <Container>
      <h1>GitHub Repositories</h1>

      {selectedRepo ? 
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'} sx={{gap: '8px'}}>
        <Button onClick={goBack} variant="contained" color="primary" >
        &#8592;
        </Button>
        <h3>Pull Requests for {selectedRepo.name}</h3>
      </Box>
      : 
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Tabs to switch views">
        <Tab label="Repositories" />
        <Tab label="Create New Repo" />
      </Tabs>}

      {tabIndex === 0 && !selectedRepo && <List>
        {data.viewer.repositories.nodes.map((repo) => (
          <ListItem key={repo.name} onClick={() => handleRepoClick(repo)} sx={{ cursor: 'pointer'}}>
            <ListItemText
              primary={repo.name}
              secondary={repo.description || 'No description available'}
            />
          </ListItem>
        ))}
      </List>}

      {tabIndex === 0 && selectedRepo && (
        <>
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
      { tabIndex === 1 && 
        <CreateRepoForm 
          refetch={refetch}  
          setTabIndex={setTabIndex}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarSeverity={setSnackbarSeverity}
          setOpenSnackbar={setOpenSnackbar}
        />
      }
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red',
          },
        }}
      />
    </Container>
  );
};

export default App;
