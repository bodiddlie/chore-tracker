import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;

export const Header = styled.div`
  background: green;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 1rem;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
`;

export const Col = styled.div``;

function getColorFromTheme({ theme, color }) {
  if (!color) return theme.blue;
  return theme[color] || color;
}

export const Button = styled.button.attrs({
  type: 'button',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  outline: none;
  border: none;
  padding: 3px;
  border: 2px solid ${props => getColorFromTheme(props)};
  background: transparent;
  cursor: pointer;
  border-radius: 5px;
  color: ${props => getColorFromTheme(props)};
  align-self: center;

  &:hover {
    background: ${props => getColorFromTheme(props)};
    color: white;
  }
`;

export const SmallButton = Button.extend`
  font-size: 1rem;
`;

export const TextButton = styled.button.attrs({
  type: 'button',
})`
  border: none;
  outline: none;
  box-shadow: none;
  font-size: 16px;
  background: transparent;
  text-align: left;
  padding: 3px;
  border-bottom: 1px solid transparent;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const TextInput = styled.input.attrs({
  type: 'text',
})`
  border: none;
  border-bottom: 1px solid #cdcdcd;
  outline: none;
  padding: 3px;
  box-shadow: none;
  font-size: 16px;
  width: 100%;
`;
