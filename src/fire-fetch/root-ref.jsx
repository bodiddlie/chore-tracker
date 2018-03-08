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

export class GetRootRef extends React.Component {
  static contextTypes = {
    rootPath: PropTypes.string,
  };

  render() {
    const render = this.props.render || this.props.children;

    return render(this.context.rootPath);
  }
}

export function withRootRef(Component) {
  return class extends React.Component {
    render() {
      return (
        <GetRootRef>
          {rootPath => <Component rootPath={rootPath} {...this.props} />}
        </GetRootRef>
      );
    }
  };
}
