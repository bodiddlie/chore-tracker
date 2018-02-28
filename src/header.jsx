import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import FaSignOut from 'react-icons/lib/fa/sign-out';
import FaUser from 'react-icons/lib/fa/user';

import { auth } from './firebase';

const Header = ({ children }, { selectedProfile, clearProfile }) => {
  return (
    <Wrapper>
      <div>{children}</div>
      <div>
        {!!selectedProfile && (
          <Button onClick={clearProfile}>
            <FaUser />
            {selectedProfile.name}
          </Button>
        )}
        <Button onClick={() => auth.signOut()}>
          <FaSignOut />Sign Out
        </Button>
      </div>
    </Wrapper>
  );
};

Header.contextTypes = {
  selectedProfile: PropTypes.object,
  clearProfile: PropTypes.func,
};

export default Header;

export const Wrapper = styled.div`
  background: ${props => props.theme.gray};
  display: flex;
  justify-content: space-between;
  padding: 1rem;
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

  &:hover {
    color: #efefef;
  }
`;
