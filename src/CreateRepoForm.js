import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { TextField, Button, Box, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';

// GraphQL mutation for creating a repository with visibility
const CREATE_REPOSITORY = gql`
  mutation($name: String!, $description: String!, $visibility: RepositoryVisibility!) {
    createRepository(input: { name: $name, description: $description, visibility: $visibility }) {
      repository {
        name
        description
      }
    }
  }
`;

const CreateRepoForm = ({ refetch, setTabIndex }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC'); // Default visibility is PUBLIC
  const [createRepo, { loading, error }] = useMutation(CREATE_REPOSITORY);

  const handleSubmit = (e) => {
    e.preventDefault();
    createRepo({ variables: { name, description, visibility } })
      .then(() => {
        setName('');
        setDescription('');
        setVisibility('PUBLIC');
        alert('Repository created successfully!');
        refetch();
        setTabIndex(0)
      })
      .catch((err) => {
        console.error('Error creating repository:', err);
        alert('Failed to create repository');
      });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" maxWidth="400px" margin="auto">
      <TextField
        label="Repository Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
      />
      <FormControl margin="normal" required>
        <InputLabel>Visibility</InputLabel>
        <Select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
        >
          <MenuItem value="PUBLIC">Public</MenuItem>
          <MenuItem value="PRIVATE">Private</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Repository'}
      </Button>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </Box>
  );
};

export default CreateRepoForm;
