import React from 'react';
import styled from 'styled-components';
import TiCancel from 'react-icons/lib/ti/cancel';
import TiDownload from 'react-icons/lib/ti/download';
import TiPencil from 'react-icons/lib/ti/pencil';
import TiTrash from 'react-icons/lib/ti/trash';
import { FirebaseRef, FirebaseQuery } from 'fire-fetch';

import { TextButton, TextInput, Button } from '../styles';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

class Profile extends React.Component {
  state = {
    editing: false,
    local: this.props.profile.name,
  };

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  handleEdit = () => {
    this.setState({ editing: true });
  };

  handleCancel = () => {
    const { profile: { name } } = this.props;
    this.setState({ editing: false, local: name });
  };

  handleSave = (event, ref) => {
    event.preventDefault();
    const { local } = this.state;
    const update = {
      name: local,
    };
    ref.update(update);
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
    const { profile: { id, name } } = this.props;
    const { editing, local } = this.state;

    return (
      <FirebaseRef path={`profiles/${id}`}>
        {ref => (
          <FirebaseQuery path={`profiles/${id}/completedChores`} on toArray>
            {chores => {
              const total = chores.reduce((prev, cur) => prev + cur.value, 0);
              return (
                <Container onSubmit={event => this.handleSave(event, ref)}>
                  {editing ? (
                    <React.Fragment>
                      <TextInput
                        innerRef={i => (this.input = i)}
                        name="local"
                        value={local}
                        onChange={this.handleChange}
                        onFocus={this.moveToEnd}
                      />
                      <Button
                        onClick={this.handleCancel}
                        color="yellow"
                        title="Cancel"
                      >
                        <TiCancel />
                      </Button>
                      <Button type="submit" color="green" title="Save">
                        <TiDownload />
                      </Button>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <TextButton onClick={this.handleEdit}>
                        {name} - {formatter.format(total)}
                      </TextButton>
                      <Button onClick={this.handleEdit} title="Edit">
                        <TiPencil />
                      </Button>
                      <Button
                        onClick={() => ref.remove()}
                        color="red"
                        title="Delete"
                      >
                        <TiTrash />
                      </Button>
                    </React.Fragment>
                  )}
                </Container>
              );
            }}
          </FirebaseQuery>
        )}
      </FirebaseRef>
    );
  }
}

const Container = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-flow: column;
  grid-gap: 10px;
`;

export default Profile;
