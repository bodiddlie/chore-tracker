import React from 'react';
import styled from 'styled-components';
import TiCancel from 'react-icons/lib/ti/cancel';
import TiDownload from 'react-icons/lib/ti/download';
import TiPencil from 'react-icons/lib/ti/pencil';
import TiTrash from 'react-icons/lib/ti/trash';
import NumericInput from 'react-numeric-input';
import format from 'date-fns/format';
import { FirebaseRef, FirebaseQuery } from 'fire-fetch';

import { Button, TextButton, TextInput } from '../styles';

class Chore extends React.Component {
  state = {
    editing: false,
    localName: this.props.chore.name,
    localValue: this.props.chore.value,
    valueClick: false,
  };

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  handleNumberChange = value => {
    this.setState({ localValue: value });
  };

  handleEdit = (valueClick = false) => {
    this.setState({ editing: true, valueClick });
  };

  handleCancel = () => {
    const { chore: { name, value } } = this.props;
    this.setState({
      editing: false,
      localName: name,
      localValue: value,
      valueClick: false,
    });
  };

  handleSave = (event, ref) => {
    event.preventDefault();
    const { localName, localValue } = this.state;
    const update = {
      name: localName,
      value: localValue,
    };
    ref.update(update);
    this.setState({ editing: false, valueClick: false });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.editing && !prevState.editing) {
      if (this.state.valueClick && this.value) {
        this.value.refsInput.focus();
      } else if (this.input) {
        this.input.focus();
      }
    }
  }

  moveToEnd = event => {
    const val = event.target.value;
    event.target.value = '';
    event.target.value = val;
  };

  render() {
    const { chore: { id, name, value } } = this.props;
    const { editing, localName, localValue } = this.state;

    return (
      <FirebaseRef path={`chores/${id}`}>
        {ref => (
          <Wrapper onSubmit={event => this.handleSave(event, ref)}>
            {editing ? (
              <React.Fragment>
                <TextInput
                  name="localName"
                  value={localName}
                  onChange={this.handleChange}
                  innerRef={i => (this.input = i)}
                  onFocus={this.moveToEnd}
                />
                <NumericInput
                  name="localValue"
                  value={localValue}
                  step={0.01}
                  min={0}
                  precision={2}
                  style={false} //eslint-disable-line
                  className="chore-value-input"
                  onChange={this.handleNumberChange}
                  ref={i => (this.value = i)}
                  onFocus={this.moveToEnd}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <TextButton onClick={() => this.handleEdit(false)}>
                  {name}
                </TextButton>
                <TextButton onClick={() => this.handleEdit(true)}>
                  ${value.toFixed(2)}
                </TextButton>
              </React.Fragment>
            )}
            <LastCompleted choreId={id} />
            {editing ? (
              <React.Fragment>
                <Actions>
                  <Button onClick={this.handleCancel} color="yellow">
                    <TiCancel />
                  </Button>
                  <Button type="submit" color="green">
                    <TiDownload />
                  </Button>
                </Actions>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Actions>
                  <Button onClick={() => this.handleEdit(false)}>
                    <TiPencil />
                  </Button>
                  <Button onClick={() => ref.remove()} color="red">
                    <TiTrash />
                  </Button>
                </Actions>
              </React.Fragment>
            )}
          </Wrapper>
        )}
      </FirebaseRef>
    );
  }
}

export default Chore;

function LastCompleted({ choreId }) {
  return (
    <FirebaseQuery
      path="completedChores"
      orderByChild="choreId"
      equalTo={choreId}
      limitToLast={1}
      on
      toArray
    >
      {lastCompleted => {
        if (lastCompleted.length > 0) {
          const { completedBy, completedDate } = lastCompleted[0];
          return (
            <Last>{`${completedBy} @ ${format(completedDate, 'MM/DD')}`}</Last>
          );
        } else {
          return <Last />;
        }
      }}
    </FirebaseQuery>
  );
}

const Wrapper = styled.form`
  display: grid;
  grid-template-columns: repeat(3, 1fr) 80px;
  grid-column-gap: 1rem;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    border: 1px solid black;
    border-radius: 5px;
    padding: 0.5rem;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Last = styled.div`
  font-size: 16px;
  padding: 3px;
  border-bottom: 1px solid transparent;
  align-self: center;
`;
