import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import SectionHeading from '@/components/SectionHeading';
import SectionSkeleton from '@/components/skeletons/SectionSkeleton';
import EditorsStrip from '@/features/skills/EditorsStrip';
import {
  useQueryFourQuery,
  useQueryOneQuery,
  useQueryTwoQuery,
} from '@/features/metric/services/statistics';
import formatDate from '@/utils/formatDate';
import {
  formatSkillPercent,
  logBarWidth,
  normalizeLanguages,
  topSkills,
} from '@/utils/skillsFromWakaTime';

const MIN_SKILLS = 5;

const SkillRow = ({ name, percent, barWidth, color, locale, t }) => {
  const formatted = formatSkillPercent(percent, locale);

  return (
    <Box
      component="li"
      aria-label={t('skills.item_label', { name, value: formatted })}
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gridTemplateRows: 'auto auto',
        columnGap: { xs: 0.75, md: 1.25 },
        rowGap: { xs: 0.4, md: 0.75 },
        alignItems: 'center',
        py: { xs: 0.25, md: 0.5 },
      }}
    >
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
        {color && (
          <Box
            aria-hidden="true"
            sx={{
              width: { xs: 5, md: 7 },
              height: { xs: 5, md: 7 },
              borderRadius: '50%',
              backgroundColor: color,
              flexShrink: 0,
            }}
          />
        )}
        <Typography
          component="span"
          variant="body2"
          noWrap
          title={name}
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
            fontWeight: 500,
          }}
        >
          {name}
        </Typography>
      </Stack>

      <Typography
        component="span"
        variant="caption"
        color="text.secondary"
        sx={{
          fontVariantNumeric: 'tabular-nums',
          textAlign: 'right',
          fontSize: { xs: '0.6875rem', md: '0.8125rem' },
        }}
      >
        {formatted} %
      </Typography>

      <Box
        aria-hidden="true"
        sx={{
          gridColumn: '1 / -1',
          height: { xs: 3, md: 5 },
          borderRadius: 999,
          backgroundColor: 'action.hover',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={(theme) => ({
            height: '100%',
            width: `${barWidth}%`,
            borderRadius: 999,
            background: theme.tokens.surface.accentGradient,
            transition: `width ${theme.tokens.motion.duration.base}s ${theme.tokens.motion.cssEase}`,
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
            },
          })}
        />
      </Box>
    </Box>
  );
};

/**
 * Top 20 lenguajes de WakaTime con barras logarítmicas + tira de editores (queryOne).
 */
const SkillsList = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith('es') ? 'es-CO' : 'en-US';

  const {
    data: languages,
    isError: languagesFailed,
    isLoading: isLoadingLanguages,
    refetch: refetchLanguages,
  } = useQueryTwoQuery();

  const { data: editors } = useQueryOneQuery();
  const { data: totals } = useQueryFourQuery();

  const isLoading = isLoadingLanguages;
  const normalized = normalizeLanguages(languages?.data);
  const skills = topSkills(normalized, 20);

  const minPercent = skills.length ? skills[skills.length - 1].percent : 0;
  const maxPercent = skills.length ? skills[0].percent : 0;

  const since = totals?.data?.range?.start ?? '2021-04-20';
  const hours = formatDate.getHours(
    totals?.data?.grand_total?.human_readable_total_including_other_language,
  );
  const days = totals?.data?.range?.days_minus_holidays;

  const subtitle =
    Number.isFinite(hours) && Number.isFinite(days)
      ? t('skills.subtitle', { since, hours, days })
      : t('skills.scale_note');

  return (
    <>
      <SectionHeading
        title={t('skills.title')}
        subtitle={subtitle}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {isLoading && <SectionSkeleton variant="skills" />}

      {!isLoading && (languagesFailed || skills.length < MIN_SKILLS) && (
        <Alert
          severity="warning"
          sx={{ maxWidth: '40rem', mx: 'auto' }}
          action={
            <Button color="inherit" size="small" onClick={() => refetchLanguages()}>
              {t('app.retry')}
            </Button>
          }
        >
          {t('skills.unavailable')}
        </Alert>
      )}

      {!isLoading && !languagesFailed && skills.length >= MIN_SKILLS && (
        <>
          <Box
            component="ul"
            aria-label={t('skills.list_label')}
            sx={{
              listStyle: 'none',
              m: 0,
              p: 0,
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(4, minmax(0, 1fr))',
              },
              columnGap: { xs: 1.75, sm: 2.5, md: 3.5 },
              rowGap: { xs: 1.25, sm: 1.75, md: 2.25 },
            }}
          >
            {skills.map((skill) => (
              <SkillRow
                key={skill.name}
                name={skill.name}
                percent={skill.percent}
                color={skill.color}
                barWidth={logBarWidth(skill.percent, minPercent, maxPercent)}
                locale={locale}
                t={t}
              />
            ))}
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: { xs: 2.5, md: 3.5 } }}
          >
            {t('skills.scale_note')}
          </Typography>

          <EditorsStrip editors={editors?.data} t={t} locale={locale} />
        </>
      )}
    </>
  );
};

export default SkillsList;
