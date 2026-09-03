import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import { useTranslation } from 'react-i18next';

import MetricDashboard from '@/containers/MetricDashboard';
import SectionHeading from '@/components/SectionHeading';
import SectionSkeleton from '@/components/skeletons/SectionSkeleton';
import MotionReveal from '@/components/MotionReveal';
import {
  useQueryFourQuery,
  useQueryThreeQuery,
  useQueryTwoQuery,
} from '@/features/metric/services/statistics';
import { buildServiceDataNote } from '@/features/service/serviceMetrics';
import resolveServiceIcon from '@/features/service/serviceIcons';
import { normalizeLanguages } from '@/utils/skillsFromWakaTime';

const MAX_SERVICES = 6;

/**
 * Diapositiva fusionada: servicios del CMS + métricas del tracker.
 * Las consultas RTK son independientes: si una falla, la otra sigue.
 */
const ServicesMetricsSection = ({ service }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith('es') ? 'es-CO' : 'en-US';

  const services = (Array.isArray(service) ? service : []).slice(0, MAX_SERVICES);

  const {
    data: languages,
    isError: languagesFailed,
    isLoading: isLoadingLanguages,
    refetch: refetchLanguages,
  } = useQueryTwoQuery();

  const {
    data: totals,
    isError: totalsFailed,
    isLoading: isLoadingTotals,
    refetch: refetchTotals,
  } = useQueryFourQuery();

  const { data: operatingSystems } = useQueryThreeQuery();

  const isLoading = isLoadingLanguages || isLoadingTotals;
  const hasServices = services.length > 0;
  const hasTotals = !totalsFailed && totals?.data;
  const normalizedLanguages = normalizeLanguages(languages?.data);

  const osLine = (() => {
    const systems = operatingSystems?.data;
    if (!Array.isArray(systems) || systems.length === 0) return null;

    const formatted = systems
      .filter((item) => item?.name && item.percent > 0)
      .slice(0, 2)
      .map((item) => {
        const pct = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
          Math.round(item.percent),
        );
        const name = item.name === 'Mac' ? 'macOS' : item.name;
        return `${pct} % ${name}`;
      })
      .join(' · ');

    return formatted ? t('metrics.os', { value: formatted }) : null;
  })();

  const handleRetry = () => {
    refetchLanguages();
    refetchTotals();
  };

  const title = hasServices ? t('service.title') : t('service.dataOnlyTitle');
  const subtitle = hasServices ? t('service.subtitle') : undefined;

  return (
    <>
      <SectionHeading title={title} subtitle={subtitle} sx={{ mb: { xs: 3, md: 5 } }} />

      {isLoading && <SectionSkeleton variant="cards" count={3} />}

      {!isLoading && totalsFailed && languagesFailed && (
        <Alert
          severity="warning"
          sx={{ maxWidth: '40rem', mx: 'auto' }}
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              {t('app.retry')}
            </Button>
          }
        >
          {t('metrics.unavailable')}
        </Alert>
      )}

      {!isLoading && (hasServices || hasTotals) && (
        <Grid
          container
          spacing={{ xs: 4, sm: 4.5, md: 6 }}
          alignItems="flex-start"
          columnSpacing={{ md: 6, lg: 8 }}
        >
          {hasServices && (
            <Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 2, md: 1 } }}>
              <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                {services.map((item, index) => {
                  const Icon = resolveServiceIcon(item?.icon);
                  const dataNote = buildServiceDataNote(
                    item?.icon,
                    normalizedLanguages,
                    t,
                    locale,
                  );

                  return (
                    <Grid key={item?.service ?? index} size={{ xs: 12, sm: 6 }}>
                      <MotionReveal delay={Math.min(index, 5) * 0.08} style={{ height: '100%' }}>
                        <Card
                          variant="outlined"
                          sx={(theme) => ({
                            height: '100%',
                            borderColor: 'divider',
                            backgroundColor: 'background.paper',
                            transition: `border-color 220ms ${theme.tokens.motion.cssEase}, box-shadow 220ms ${theme.tokens.motion.cssEase}`,
                            '&:hover': {
                              borderColor: 'primary.main',
                              boxShadow: theme.tokens.elevation.sm,
                            },
                          })}
                        >
                          <CardContent
                            sx={{
                              p: { xs: 2.5, md: 3 },
                              '&:last-child': { pb: { xs: 2.5, md: 3 } },
                            }}
                          >
                            <Box
                              aria-hidden="true"
                              sx={{
                                color: 'primary.main',
                                mb: 1.75,
                                display: 'flex',
                                width: 40,
                                height: 40,
                                borderRadius: (theme) => `${theme.tokens.radius.md}px`,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'action.hover',
                              }}
                            >
                              <Icon fontSize="small" />
                            </Box>

                            {item?.service && (
                              <Typography
                                variant="h5"
                                component="h3"
                                color="text.primary"
                                gutterBottom
                              >
                                {item.service}
                              </Typography>
                            )}

                            {item?.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: dataNote ? 2 : 0, lineHeight: 1.6 }}
                              >
                                {item.description}
                              </Typography>
                            )}

                            {dataNote && (
                              <Stack direction="row" spacing={0.75} alignItems="center">
                                <QueryStatsRoundedIcon
                                  sx={{ fontSize: 14, color: 'text.secondary' }}
                                  aria-hidden="true"
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {dataNote.value}
                                </Typography>
                              </Stack>
                            )}
                          </CardContent>
                        </Card>
                      </MotionReveal>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          )}

          {hasTotals && (
            <Grid
              size={{ xs: 12, md: hasServices ? 5 : 12 }}
              sx={{
                order: { xs: 1, md: 2 },
                pl: { md: hasServices ? 1 : 0 },
                borderLeft: {
                  xs: 'none',
                  md: hasServices ? '1px solid' : 'none',
                },
                borderColor: { md: 'divider' },
              }}
            >
              <MetricDashboard data={totals.data} compact={Boolean(hasServices)} />
              {osLine && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 2.5 }}
                >
                  {osLine}
                </Typography>
              )}
            </Grid>
          )}
        </Grid>
      )}

      {!isLoading && !hasServices && !hasTotals && !totalsFailed && !languagesFailed && (
        <Typography variant="body2" color="text.secondary" align="center">
          {t('metrics.unavailable')}
        </Typography>
      )}
    </>
  );
};

export default ServicesMetricsSection;
