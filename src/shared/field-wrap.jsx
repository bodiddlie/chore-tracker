import styled from 'styled-components';

export const InputGroup = styled.div`
  width: 100%;
  margin-bottom: 0.25rem;
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
  border: 1px solid transparent;
  border-bottom: 1px solid
    ${props => (props.focused ? props.theme.blue : '#cdcdcd')};

  &::after {
    content: '';
    display: block;
    margin: auto;
    height: 2px;
    width: ${props => (props.focused ? '100%' : '0')};
    background: ${props => props.theme.blue};
    transition: all 0.25s;
  }
`;

export const Label = styled.label`
  font-weight: bold;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  color: ${props => (props.focused ? props.theme.blue : 'black')};
`;

export const Input = styled.input`
  padding: 3px;
  border: none;
  box-shadow: none;
  outline: none;
  width: 100%;
  font-size: 16px;
`;
