import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

const E404 = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 3,
        py: 8,
        backgroundColor: 'background.default',
      }}
    >
      <Stack spacing={2} alignItems="center" textAlign="center" sx={{ maxWidth: '38rem' }}>
        <Typography variant="h1" component="p" color="primary" aria-hidden="true">
          404
        </Typography>
        <Typography variant="h2" component="h1">
          {t('errors.not_found_title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('errors.not_found_body')}
        </Typography>
        <Button variant="contained" href="/">
          {t('errors.back_home')}
        </Button>
      </Stack>
    </Box>
  );
};

export default E404;
