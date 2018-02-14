import React from 'react';
import styled from 'styled-components';
import { TiCancel, TiDownload, TiPencil, TiTrash } from 'react-icons/lib/ti';
import NumericInput from 'react-numeric-input';
import format from 'date-fns/format';

import { db } from '../firebase';
import { withUser } from '../user';
import { Button, TextButton, TextInput } from '../styles';

class Chore extends React.Component {
  state = {
    editing: false,
    localName: this.props.chore.name,
    localValue: this.props.chore.value,
    valueClick: false,
    completedBy: '',
  };

  componentDidMount() {
    const { user, chore } = this.props;
    this.bindKeyPress();
    this.ref = db.ref(`/families/${user.uid}/chores/${chore.id}`);
    this.lastCompletedRef = db
      .ref(`/families/${user.uid}/completedChores`)
      .orderByChild('choreId')
      .equalTo(chore.id)
      .limitToLast(1);
    this.lastCompletedRef.on('value', snapshot => {
      snapshot.forEach(child => {
        const { completedBy, completedDate } = child.val();
        db
          .ref(`/families/${user.uid}/profiles/${completedBy}`)
          .once('value')
          .then(snapshot => {
            const { name } = snapshot.val();
            this.setState({
              completedBy: `${name} @ ${format(completedDate, 'MM/DD')}`,
            });
          });
      });
    });
  }

  componentWillUnmount() {
    this.unbindKeyPress();
    this.ref.off();
    this.lastCompletedRef.off();
  }

  bindKeyPress() {
    document.addEventListener('keypress', this.handleKeyPress, false);
  }

  unbindKeyPress() {
    document.removeEventListener('keypress', this.handleKeyPress);
  }

  handleKeyPress = e => {
    if (this.state.editing && e.keyCode === 13) {
      this.handleSave(e);
    }
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

  handleDelete = () => {
    this.ref.remove();
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

  handleSave = event => {
    event.preventDefault();
    const { localName, localValue } = this.state;
    const update = {
      name: localName,
      value: localValue,
    };
    this.ref.update(update);
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
    const { chore: { name, value } } = this.props;
    const { editing, localName, localValue, completedBy } = this.state;

    return (
      <Wrapper>
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
            <span>{completedBy}</span>
            <Actions>
              <Button onClick={this.handleCancel} color="yellow">
                <TiCancel />
              </Button>
              <Button onClick={this.handleSave} color="green">
                <TiDownload />
              </Button>
            </Actions>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <TextButton onClick={this.handleEdit}>{name}</TextButton>
            <TextButton onClick={() => this.handleEdit(true)}>
              ${value.toFixed(2)}
            </TextButton>
            <Last>{completedBy}</Last>
            <Actions>
              <Button onClick={this.handleEdit}>
                <TiPencil />
              </Button>
              <Button onClick={this.handleDelete} color="red">
                <TiTrash />
              </Button>
            </Actions>
          </React.Fragment>
        )}
      </Wrapper>
    );
  }
}

export default withUser(Chore);

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr) 80px;
  grid-column-gap: 1rem;
  margin-bottom: 0.5rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Last = styled.div`
  font-size: 0.9rem;
  padding: 3px;
  border-bottom: 1px solid transparent;
  align-self: center;
`;
