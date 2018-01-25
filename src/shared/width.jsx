import React from 'react';

class Width extends React.Component {
  state = {
    width: window.innerWidth,
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ width: window.innerWidth });
  };

  render() {
    return this.props.children(this.state.width);
  }
}

export default Width;
