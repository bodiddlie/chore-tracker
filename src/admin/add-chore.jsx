import React from 'react';
import styled from 'styled-components';
import TiPlus from 'react-icons/lib/ti/plus';
import { FirebaseRef, withRootRef } from 'fire-fetch';

import { TextBox, NumberField } from '../shared';
import { Button } from '../styles';

const initialState = {
  name: '',
  value: 0.0,
};

class AddChore extends React.Component {
  state = initialState;

  handleSubmit = (event, ref) => {
    event.preventDefault();

    const { name, value } = this.state;
    const { rootPath } = this.props;

    let parsed = parseFloat(value);

    if (this.validate()) {
      const { key } = ref.push();

      const chore = { name, value: parsed, id: key };

      const update = {
        [`${rootPath}/chores/${key}`]: chore,
      };

      ref.root.update(update);

      this.setState(initialState);
    }
  };

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  handleNumberChange = (value, _, input) => {
    this.setState({ value });
  };

  validate = () => {
    const { name, value } = this.state;
    let parsed = parseFloat(value);
    return name.length && !isNaN(parsed) && parsed > 0;
  };

  render() {
    const { name, value } = this.state;

    return (
      <FirebaseRef path="chores">
        {ref => (
          <Form onSubmit={event => this.handleSubmit(event, ref)}>
            <TextBox
              label="New Chore Name"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
            <NumberField
              label="Value"
              name="value"
              value={value}
              onChange={this.handleNumberChange}
            />
            <Button type="submit" disabled={!this.validate()} color="green">
              <TiPlus />
            </Button>
          </Form>
        )}
      </FirebaseRef>
    );
  }
}

export default withRootRef(AddChore);

const Form = styled.form`
  display: grid;
  grid-template-columns: 2fr 2fr;
  grid-auto-flow: column;
  grid-gap: 5px;
  width: 100%;
`;
