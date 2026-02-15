import { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error Boundary caught:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-boundary-card">
                        <div className="error-boundary-icon">
                            <FiAlertTriangle size={48} />
                        </div>
                        <h2>Something went wrong</h2>
                        <p>An unexpected error occurred. Please try again.</p>
                        {this.state.error && (
                            <pre className="error-details">{this.state.error.message}</pre>
                        )}
                        <button className="error-reset-btn" onClick={this.handleReset}>
                            <FiRefreshCw size={18} />
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
