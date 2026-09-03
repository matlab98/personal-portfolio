import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';

import MotionReveal from '@/components/MotionReveal';
import formatDate from '@/utils/formatDate';

const STAT_SX = {
  fontSize: 'clamp(2rem, 1.2rem + 3.4vw, 3.5rem)',
  fontWeight: 800,
  lineHeight: 1,
  letterSpacing: '-0.02em',
  fontVariantNumeric: 'tabular-nums',
  color: 'secondary.main',
};

const StatValue = ({ value, animate }) => {
  if (!Number.isFinite(value)) return null;

  if (animate) {
    return (
      <Typography component="span" sx={STAT_SX}>
        <CountUp end={value} duration={2} separator="," />
      </Typography>
    );
  }

  return (
    <Typography component="span" sx={STAT_SX}>
      {value.toLocaleString()}
    </Typography>
  );
};

const MetricBlock = ({ label, value, animate, delay = 0, compact }) => {
  if (!Number.isFinite(value)) return null;

  return (
    <MotionReveal delay={delay}>
      <Box
        sx={{
          textAlign: { xs: compact ? 'center' : 'left', md: 'left' },
          minWidth: compact ? { xs: 120, sm: 140 } : undefined,
          flex: compact ? { xs: '0 0 auto', md: 'none' } : undefined,
          py: { xs: compact ? 0.5 : 0, md: 0 },
        }}
      >
        <StatValue value={value} animate={animate} />
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mt: { xs: 0.75, md: 1.25 }, maxWidth: '16ch' }}
        >
          {label}
        </Typography>
      </Box>
    </MotionReveal>
  );
};

/**
 * Bloque de cifras del tracker (queryFour). Tres tarjetas principales +
 * mejor día y promedio diario como líneas secundarias.
 */
const MetricDashboard = ({ data, compact = false, showSource = true }) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animate = inView && !prefersReducedMotion;

  const daysIncluding = data?.range?.days_including_holidays;
  const activeDays = data?.range?.days_minus_holidays;
  const readableTotal = data?.grand_total?.human_readable_total_including_other_language;
  const dailyAverage = data?.grand_total?.human_readable_daily_average_including_other_language;
  const bestDayText = data?.best_day?.text;
  const bestDayDate = data?.best_day?.date;

  const primaryMetrics = [
    {
      id: 'hours',
      label: t('metrics.hours'),
      value: formatDate.getHours(readableTotal),
    },
    {
      id: 'years',
      label: t('metrics.years'),
      value: formatDate.convertDaysToYearsByDate(daysIncluding),
    },
    {
      id: 'activeDays',
      label: t('metrics.activeDays'),
      value: Number.isFinite(activeDays) ? activeDays : null,
    },
  ].filter((metric) => Number.isFinite(metric.value));

  if (primaryMetrics.length === 0) return null;

  const bestDayLabel =
    bestDayText && bestDayDate
      ? t('metrics.bestDay', { value: `${bestDayText} · ${bestDayDate}` })
      : null;

  const dailyAverageLabel = dailyAverage
    ? t('metrics.dailyAverage', { value: dailyAverage })
    : null;

  return (
    <Box ref={containerRef} aria-label={t('service.dataOnlyTitle')}>
      <Stack
        direction={{ xs: 'row', md: 'column' }}
        spacing={compact ? { xs: 2.5, md: 3.5 } : { xs: 3, md: 4.5 }}
        sx={{
          overflowX: { xs: 'auto', md: 'visible' },
          pb: { xs: 1, md: 0 },
          mx: { xs: -0.5, md: 0 },
          px: { xs: 0.5, md: 0 },
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          justifyContent: { xs: compact ? 'flex-start' : 'space-between', md: 'flex-start' },
        }}
      >
        {primaryMetrics.map((metric, index) => (
          <MetricBlock
            key={metric.id}
            label={metric.label}
            value={metric.value}
            animate={animate}
            delay={index * 0.1}
            compact={compact}
          />
        ))}
      </Stack>

      {(bestDayLabel || dailyAverageLabel) && (
        <Stack spacing={0.75} sx={{ mt: { xs: 2.5, md: 3.5 } }}>
          {bestDayLabel && (
            <Typography variant="caption" color="text.secondary">
              {bestDayLabel}
            </Typography>
          )}
          {dailyAverageLabel && (
            <Typography variant="caption" color="text.secondary">
              {dailyAverageLabel}
            </Typography>
          )}
        </Stack>
      )}

      {showSource && (
        <Link
          href="https://wakatime.com/@hilbrakaku"
          target="_blank"
          rel="noopener noreferrer"
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 2.5,
            minHeight: 44,
          }}
        >
          <InsightsRoundedIcon sx={{ fontSize: 14 }} aria-hidden="true" />
          {t('service.source')}
        </Link>
      )}
    </Box>
  );
};

export default MetricDashboard;
