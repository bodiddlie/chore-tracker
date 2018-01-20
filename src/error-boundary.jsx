import React from 'react';

class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    errorInfo: null,
  };

  componentDidCatch(hasError, errorInfo) {
    this.setState({
      hasError,
      errorInfo,
    });
  }

  render() {
    const { children, message } = this.props;
    const { hasError, errorInfo } = this.state;

    return hasError ? (
      <div>
        <p>{message}</p>
        <pre>
          <code>{errorInfo.componentStack}</code>
        </pre>
      </div>
    ) : (
      children
    );
  }
}

export default ErrorBoundary;
