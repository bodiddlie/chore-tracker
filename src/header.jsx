import React from 'react';
import styled from 'styled-components';
import FaSignOut from 'react-icons/lib/fa/sign-out';
import FaUser from 'react-icons/lib/fa/user';

import { auth } from './firebase';

class Header extends React.Component {
  state = {
    open: false,
  };

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  handleOutsideClick = e => {
    if (this.node && this.node.contains(e.target)) return;

    this.setState({ open: false });
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  render() {
    const { open } = this.state;
    const { selectedProfile, clearProfile } = this.props;

    return (
      <Wrapper>
        {!!selectedProfile ? (
          <MenuContainer
            innerRef={node => {
              this.node = node;
            }}
          >
            <Button onClick={this.handleClick}>{selectedProfile.name}</Button>
            {open && (
              <Menu>
                <MenuButton onClick={clearProfile}>
                  <FaUser /> Switch Profile
                </MenuButton>
                <MenuButton onClick={() => auth.signOut()}>
                  <FaSignOut />Sign Out
                </MenuButton>
              </Menu>
            )}
          </MenuContainer>
        ) : (
          <Button onClick={() => auth.signOut()}>
            <FaSignOut /> Sign Out
          </Button>
        )}
      </Wrapper>
    );
  }
}

export default Header;

const Wrapper = styled.div`
  background: ${props => props.theme.gray};
  height: 2.5rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Button = styled.button.attrs({
  type: 'button',
})`
  border: none;
  background: transparent;
  color: ${props => props.theme.lightgray};
  outline: none;
  box-shadow: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s linear;
  font-size: 1rem;

  &:hover {
    color: #efefef;
  }
`;

const MenuContainer = styled.div`
  position: relative;
`;

const Menu = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  position: absolute;
  top: 100%;
  right: 5%;
  background: ${props => props.theme.lightgray};
  border: 1px solid black;
  border-radius: 5px;
  padding: 0.5rem;
  width: 180px;
`;

const MenuButton = styled.button.attrs({
  type: 'button',
})`
  border: none;
  background: transparent;
  color: black;
  outline: none;
  box-shadow: none;
  cursor: pointer;
  transition: all 0.2s linear;
  text-align: left;
  font-size: 0.8rem;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
