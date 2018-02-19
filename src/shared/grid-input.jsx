import React from 'react';
import styled from 'styled-components';

function GridInput(props) {
  const { label, name, ...rest } = props;

  return (
    <Wrapper>
      <Label htmlFor={`field-${name}`}>{label}</Label>
      <TextInput name={name} {...rest} />
    </Wrapper>
  );
}

export default GridInput;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
  font-size: 0.9rem;
`;

const TextInput = styled.input.attrs({
  type: 'text',
})`
  border: none;
  border-bottom: 1px solid #cdcdcd;
  outline: none;
  padding: 3px;
  box-shadow: none;
  font-size: 0.9rem;
  width: 100%;
`;
