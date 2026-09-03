import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import MotionReveal from '@/components/MotionReveal';
import SectionHeading from '@/components/SectionHeading';
import resolveServiceIcon from './serviceIcons';

const Service = ({ service }) => {
  const { t } = useTranslation();

  const services = Array.isArray(service) ? service : [];
  if (services.length === 0) return null;

  return (
    <>
      <SectionHeading title={t('service.title')} subtitle={t('service.description')} />

      <Grid container spacing={{ xs: 2.5, md: 4 }}>
        {services.map((item, index) => {
          const Icon = resolveServiceIcon(item?.icon);

          return (
            <Grid key={item?.service ?? index} size={{ xs: 12, sm: 6, md: 4 }}>
              <MotionReveal delay={Math.min(index, 5) * 0.08} style={{ height: '100%' }}>
                <Card
                  sx={(theme) => ({
                    height: '100%',
                    '&:hover': {
                      boxShadow: theme.tokens.elevation.md,
                      borderColor: theme.palette.primary.main,
                    },
                  })}
                >
                  <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                    <Box
                      aria-hidden="true"
                      sx={(theme) => ({
                        width: 52,
                        height: 52,
                        display: 'grid',
                        placeItems: 'center',
                        mb: 2,
                        borderRadius: `${theme.tokens.radius.md}px`,
                        color: theme.palette.primary.contrastText,
                        background: theme.tokens.surface.accentGradient,
                      })}
                    >
                      <Icon />
                    </Box>

                    {item?.service && (
                      <Typography variant="h5" component="h3" color="text.primary" gutterBottom>
                        {item.service}
                      </Typography>
                    )}

                    {item?.description && (
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </MotionReveal>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default Service;
