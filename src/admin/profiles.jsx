import React from 'react';
import styled from 'styled-components';
import {
  TiCancel,
  TiDownload,
  TiPencil,
  TiPlus,
  TiTrash,
} from 'react-icons/lib/ti';

import { db } from '../firebase';
import { withUser } from '../user';
import { TextBox } from '../shared';
import { Button, TextButton, TextInput } from '../styles';

class ProfileList extends React.Component {
  state = {
    name: '',
  };

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  validate = () => {
    return !!this.state.name.length;
  };

  onSubmit = event => {
    event.preventDefault();
    const { user } = this.props;
    const { name } = this.state;
    if (this.validate()) {
      const { key } = db.ref(`/families/${user.uid}/profiles`).push();
      const profile = { name, id: key };
      const update = {
        [`/families/${user.uid}/profiles/${key}`]: profile,
      };

      db.ref().update(update);

      this.setState({ name: '' });
    }
  };

  render() {
    const { profiles, user } = this.props;
    const { name } = this.state;

    return (
      <Grid>
        <Heading>Profiles</Heading>
        <AddEdit onSubmit={this.onSubmit}>
          <TextBox
            value={name}
            label="New Profile Name"
            name="name"
            onChange={this.handleChange}
          />
          <Button type="submit" color="green">
            <TiPlus />
          </Button>
        </AddEdit>
        <List>
          {profiles.map(p => <Profile key={p.id} profile={p} user={user} />)}
        </List>
      </Grid>
    );
  }
}

export default withUser(ProfileList);

const Grid = styled.div`
  display: grid;
  grid-gap: 1rem;
  padding: 1rem;
`;

const Heading = styled.h4`
  margin: 0;
  padding: 0;
`;

const List = styled.div`
  display: grid;
  grid-gap: 0.25rem;
`;

const AddEdit = styled.form`
  display: grid;
  grid-template-columns: 3fr 1fr;
  justify-items: center;
  align-items: center;
`;

class Profile extends React.Component {
  state = {
    editing: false,
    local: this.props.profile.name,
  };

  componentDidMount() {
    const { user, profile } = this.props;
    this.ref = db.ref(`/families/${user.uid}/profiles/${profile.id}`);
  }

  componentWillUnmount() {
    this.ref.off();
  }

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  handleEdit = () => {
    this.setState({ editing: true });
  };

  handleDelete = () => {
    this.ref.remove();
  };

  handleCancel = () => {
    const { profile: { name } } = this.props;
    this.setState({ editing: false, local: name });
  };

  handleSave = event => {
    event.preventDefault();
    const { local } = this.state;
    const update = {
      name: local,
    };
    this.ref.update(update);
    this.setState({ editing: false });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.editing && !prevState.editing && this.input) {
      this.input.focus();
    }
  }

  moveToEnd = event => {
    const val = event.target.value;
    event.target.value = '';
    event.target.value = val;
  };

  render() {
    const { profile: { name } } = this.props;
    const { editing, local } = this.state;

    return (
      <Container onSubmit={this.handleSave}>
        {editing ? (
          <React.Fragment>
            <TextInput
              innerRef={i => (this.input = i)}
              name="local"
              value={local}
              onChange={this.handleChange}
              onFocus={this.moveToEnd}
            />
            <Button onClick={this.handleCancel} color="yellow" title="Cancel">
              <TiCancel />
            </Button>
            <Button type="submit" color="green" title="Save">
              <TiDownload />
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <TextButton onClick={this.handleEdit}>{name}</TextButton>
            <Button onClick={this.handleEdit} title="Edit">
              <TiPencil />
            </Button>
            <Button onClick={this.handleDelete} color="red" title="Delete">
              <TiTrash />
            </Button>
          </React.Fragment>
        )}
      </Container>
    );
  }
}

const Container = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-flow: column;
  grid-gap: 10px;
`;
