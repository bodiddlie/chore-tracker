import React from 'react';

import { InputGroup, Label, Input } from './field-wrap';

class TextBox extends React.Component {
  state = {
    focused: false,
    dirty: !!this.props.value && this.props.value.length > 0,
  };

  handleChange = event => {
    this.props.onChange(event);
    this.setState({ dirty: true });
  };

  render() {
    const {
      name,
      label,
      type,
      required,
      value,
      onChange,
      ...rest
    } = this.props;
    const { focused, dirty } = this.state;

    const invalid = required && dirty && (!value || !value.length);

    return (
      <InputGroup focused={focused} invalid={invalid}>
        {label &&
          label.length && (
            <Label
              htmlFor={`field-${name}`}
              show={!!value && value.length > 0}
              focused={focused}
            >
              {label} {required && (!value || value.length === 0) && '*'}
            </Label>
          )}
        <Input
          type={type || 'text'}
          id={`field-${name}`}
          name={name}
          value={value}
          onFocus={() => this.setState({ focused: true })}
          onBlur={() => this.setState({ focused: false })}
          required={required}
          onChange={this.handleChange}
          {...rest}
        />
      </InputGroup>
    );
  }
}

export default TextBox;
