import React from 'react';
import NumericInput from 'react-numeric-input';

import { InputGroup, Label } from './field-wrap';

class NumberField extends React.Component {
  state = {
    focused: false,
  };

  render() {
    const { name, label, required, value, ...rest } = this.props;
    const { focused } = this.state;

    return (
      <InputGroup focused={focused}>
        {label &&
          label.length && (
            <Label htmlFor={`field-${name}`} focused={focused}>
              {label} {required && '*'}
            </Label>
          )}
        <NumericInput
          id={`field-${name}`}
          name={name}
          value={value}
          step={0.01}
          min={0}
          precision={2}
          style={false} //eslint-disable-line
          className="number-input"
          onFocus={() => this.setState({ focused: true })}
          onBlur={() => this.setState({ focused: false })}
          {...rest}
        />
      </InputGroup>
    );
  }
}

export default NumberField;
