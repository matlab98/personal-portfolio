import { useCallback } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import useActiveSection from '@/hooks/useActiveSection';
import useReducedMotion from '@/hooks/useReducedMotion';
import { scrollToSection } from '@/utils/scroll';

/**
 * Overlay de índice a pantalla completa. Lista numerada de diapositivas.
 * Privacidad: solo email + redes; nunca teléfono ni ubicación.
 *
 * @param {{ id: string, labelKey?: string }[]} sections
 * @param {{ email?: string | string[], social?: object }} [contact]
 */
const SlideIndex = ({ open, onClose, sections = [], contact }) => {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const sectionIds = sections.map((section) => section.id).filter(Boolean);
  const activeId = useActiveSection(sectionIds);

  const handleSelect = useCallback(
    (event, sectionId) => {
      event.preventDefault();
      onClose();
      scrollToSection(sectionId);
    },
    [onClose],
  );

  const contactEmail = Array.isArray(contact?.email)
    ? contact.email.find(Boolean)
    : contact?.email;

  const socialLinks = contact?.social
    ? Object.entries(contact.social).filter(([, url]) => Boolean(url))
    : [];

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      aria-labelledby="slide-index-title"
      PaperProps={{
        sx: (theme) => ({
          backgroundColor: theme.tokens.surface.scrim,
          backdropFilter: 'blur(16px)',
          color: 'text.primary',
        }),
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: { xs: 2.5, md: 4 }, py: 2 }}
      >
        <Typography id="slide-index-title" variant="h6" component="p" sx={{ fontWeight: 700 }}>
          {t('nav.index_title')}
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label={t('nav.close_index')}
          color="inherit"
          sx={(theme) => ({
            '&:focus-visible': {
              outline: `2px solid ${theme.tokens.surface.outlineStrong}`,
              outlineOffset: 2,
            },
          })}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Stack>

      <Box
        component="nav"
        aria-label={t('nav.primary')}
        sx={{ flex: 1, px: { xs: 2.5, md: 4 }, pb: 4, overflowY: 'auto' }}
      >
        <Stack component="ul" spacing={0} sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {sections.map((section, index) => {
            const label = t(section.labelKey ?? `nav.${section.id}`);
            const number = String(index + 1).padStart(2, '0');
            const isActive = activeId === section.id;
            const ItemWrapper = prefersReducedMotion ? Box : motion.li;
            const motionProps = prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, x: -12 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: index * 0.04, duration: 0.35 },
                };

            return (
              <ItemWrapper key={section.id} component="li" {...motionProps}>
                <Box
                  component="a"
                  href={`#${section.id}`}
                  onClick={(event) => handleSelect(event, section.id)}
                  aria-current={isActive ? 'true' : undefined}
                  sx={(theme) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: { xs: 2, md: 2.5 },
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: isActive ? 'primary.main' : 'inherit',
                    textDecoration: 'none',
                    transition: 'transform 200ms, color 200ms',
                    '&:hover, &:focus-visible': {
                      color: 'primary.main',
                      transform: 'translateX(8px)',
                      outline: 'none',
                    },
                    '&:focus-visible': {
                      boxShadow: `inset 0 0 0 2px ${theme.tokens.surface.outlineStrong}`,
                    },
                  })}
                >
                  <Typography
                    variant="overline"
                    component="span"
                    sx={{ minWidth: 32, color: 'text.secondary' }}
                  >
                    {number}
                  </Typography>
                  {isActive && (
                    <Box
                      aria-hidden="true"
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <Typography variant="h5" component="span" sx={{ fontWeight: 700 }}>
                    {label}
                  </Typography>
                </Box>
              </ItemWrapper>
            );
          })}
        </Stack>
      </Box>

      {(contactEmail || socialLinks.length > 0) && (
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={2}
          sx={{
            px: { xs: 2.5, md: 4 },
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          {contactEmail && (
            <Typography
              component="a"
              href={`mailto:${contactEmail}`}
              variant="body2"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
                '&:focus-visible': (theme) => ({
                  outline: `2px solid ${theme.tokens.surface.outlineStrong}`,
                  outlineOffset: 2,
                }),
              }}
            >
              {contactEmail}
            </Typography>
          )}
          {socialLinks.map(([name, url]) => (
            <Typography
              key={name}
              component="a"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
                '&:focus-visible': (theme) => ({
                  outline: `2px solid ${theme.tokens.surface.outlineStrong}`,
                  outlineOffset: 2,
                }),
              }}
            >
              {name}
            </Typography>
          ))}
        </Stack>
      )}
    </Dialog>
  );
};

export default SlideIndex;
