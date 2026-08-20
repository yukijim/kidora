import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', fontFamily: 'system-ui, sans-serif', background: '#f8fafb', color: '#2d3748' }}>
          <div>
            <div style={{ fontSize: 52 }}>😕</div>
            <h2 style={{ margin: '12px 0 8px' }}>Oops, ada masalah teknikal</h2>
            <p style={{ color: '#6b7a8d', margin: '0 0 20px' }}>Sila muat semula halaman.</p>
            <button onClick={() => window.location.reload()} style={{ background: '#4a90e2', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 999, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              Muat Semula
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
