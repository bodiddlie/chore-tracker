import React from 'react';
import PropTypes from 'prop-types';

export class User extends React.Component {
  static contextTypes = {
    user: PropTypes.object,
  };

  render() {
    return this.props.children(this.context.user);
  }
}

export function withUser(Component) {
  return class extends React.Component {
    render() {
      return <User>{user => <Component user={user} {...this.props} />}</User>;
    }
  };
}
