import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

const Fallback = ({ scope, onRetry }) => {
  const { t } = useTranslation();
  const isApp = scope === 'app';

  return (
    <Box
      role="alert"
      sx={{
        minHeight: isApp ? '100dvh' : '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        px: 2,
        py: 4,
      }}
    >
      <Typography variant={isApp ? 'h6' : 'subtitle1'} align="center">
        {t(isApp ? 'errors.app_title' : 'errors.section_title')}
      </Typography>
      <Typography variant="body2" align="center" color="text.secondary">
        {t(isApp ? 'errors.app_body' : 'errors.section_body')}
      </Typography>
      <Button variant={isApp ? 'contained' : 'outlined'} onClick={onRetry}>
        {t(isApp ? 'errors.reload' : 'app.retry')}
      </Button>
    </Box>
  );
};

/**
 * Suspense no atrapa errores de render: sin esto, un throw en una sección
 * desmonta la página completa.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(`[ErrorBoundary:${this.props.scope || 'section'}]`, error, info?.componentStack);
  }

  handleRetry() {
    if (this.props.scope === 'app') {
      window.location.reload();
      return;
    }
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) {
      return <Fallback scope={this.props.scope} onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
