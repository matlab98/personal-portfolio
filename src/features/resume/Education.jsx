import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import { useTranslation } from 'react-i18next';

import MotionReveal from '@/components/MotionReveal';
import SectionHeading from '@/components/SectionHeading';

/**
 * Timeline de formación y experiencia.
 *
 * Móvil: una sola columna con la línea a la izquierda.
 * Desktop (md+): columnas alternadas alrededor de una línea central.
 * La versión anterior usaba `padding-left: 50%` fijo y se rompía por debajo de 900px.
 */
const Education = ({ education, hideHeader = false }) => {
  const { t } = useTranslation();

  const items = Array.isArray(education) ? education : [];
  if (items.length === 0) return null;

  return (
    <>
      {!hideHeader && (
        <SectionHeading title={t('education.title')} subtitle={t('education.subtitle')} />
      )}

      <Box sx={{ position: 'relative', mx: 'auto', maxWidth: '68rem' }}>
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '2px',
            left: { xs: '11px', md: '50%' },
            ml: { md: '-1px' },
            backgroundColor: 'divider',
          }}
        />

        <Stack component="ol" spacing={{ xs: 3, md: 4 }} sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {items.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <Box
                component="li"
                key={`${item?.institution_name ?? 'item'}-${item?.date ?? index}`}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '24px 1fr', md: '1fr 48px 1fr' },
                  columnGap: { xs: 2, md: 0 },
                  alignItems: 'start',
                }}
              >
                <Box
                  aria-hidden="true"
                  sx={{
                    gridRow: 1,
                    gridColumn: { xs: '1', md: '2' },
                    display: 'flex',
                    justifyContent: 'center',
                    pt: '20px',
                  }}
                >
                  <Box
                    sx={(theme) => ({
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.primary.main,
                      boxShadow: `0 0 0 4px ${theme.palette.background.default}`,
                    })}
                  />
                </Box>

                <Box
                  sx={{
                    gridRow: 1,
                    gridColumn: { xs: '2', md: isLeft ? '1' : '3' },
                    pr: { md: isLeft ? 4 : 0 },
                    pl: { md: isLeft ? 0 : 4 },
                    textAlign: { xs: 'left', md: isLeft ? 'right' : 'left' },
                  }}
                >
                  <MotionReveal delay={Math.min(index, 4) * 0.08} y={20}>
                    <Card>
                      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{
                            mb: 1,
                            justifyContent: { xs: 'flex-start', md: isLeft ? 'flex-end' : 'flex-start' },
                          }}
                        >
                          <SchoolRoundedIcon fontSize="small" color="primary" aria-hidden="true" />
                          {item?.date && (
                            <Typography variant="overline" component="p" color="text.secondary">
                              {item.date}
                            </Typography>
                          )}
                        </Stack>

                        {item?.institution_name && (
                          <Typography variant="h4" component="h3" color="text.primary">
                            {item.institution_name}
                          </Typography>
                        )}

                        {item?.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {item.description}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </MotionReveal>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </>
  );
};

export default Education;
