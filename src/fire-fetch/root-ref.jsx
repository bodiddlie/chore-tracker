import React from 'react';
import PropTypes from 'prop-types';

class RootRef extends React.Component {
  state = {
    rootPath: this.props.path || '',
  };

  static childContextTypes = {
    rootPath: PropTypes.string,
  };

  getChildContext() {
    return this.state;
  }

  componentDidUpdate(prevProps) {
    const { path } = this.props;

    if (path !== prevProps.path) {
      this.setState({ rootPath: path });
    }
  }

  render() {
    return this.props.children;
  }
}

export default RootRef;
