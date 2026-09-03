import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import useActiveSection from '@/hooks/useActiveSection';
import { scrollToSection } from '@/utils/scroll';

/**
 * Riel vertical de puntos (md+). Navegación real por anclas con estado activo.
 *
 * @param {{ id: string, labelKey?: string }[]} sections
 */
const SlideProgressRail = ({ sections = [] }) => {
  const { t } = useTranslation();
  const sectionIds = sections.map((s) => s.id).filter(Boolean);
  const activeId = useActiveSection(sectionIds);
  const [highlighted, setHighlighted] = useState(false);

  const handleNavigate = useCallback((event, sectionId) => {
    event.preventDefault();
    scrollToSection(sectionId);
    setHighlighted(true);
    window.setTimeout(() => setHighlighted(false), 1200);
  }, []);

  if (sectionIds.length === 0) return null;

  return (
    <Box
      component="nav"
      aria-label={t('progress.label')}
      onMouseEnter={() => setHighlighted(true)}
      onMouseLeave={() => setHighlighted(false)}
      onFocus={() => setHighlighted(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setHighlighted(false);
        }
      }}
      sx={(theme) => ({
        position: 'fixed',
        left: {
          md: theme.tokens.layout.railOffset.md,
          lg: theme.tokens.layout.railOffset.lg,
        },
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: theme.zIndex.appBar - 1,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        width: theme.tokens.layout.railWidth,
        opacity: highlighted ? 1 : 0.45,
        transition: `opacity ${theme.tokens.motion.duration.fast}s ${theme.tokens.motion.cssEase}`,
        '@media (max-height: 640px)': { display: 'none' },
      })}
    >
      {sections.map((section) => {
        const isActive = activeId === section.id;
        const label = t(section.labelKey ?? `nav.${section.id}`);
        return (
          <Box
            key={section.id}
            sx={{
              position: 'relative',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover .slide-rail-label, &:focus-within .slide-rail-label': {
                opacity: 1,
              },
            }}
          >
            <Box
              component="a"
              href={`#${section.id}`}
              onClick={(event) => handleNavigate(event, section.id)}
              aria-current={isActive ? 'true' : undefined}
              aria-label={t('progress.go_to', { name: label })}
              sx={(theme) => ({
                display: 'block',
                width: 6,
                height: isActive ? 22 : 6,
                borderRadius: theme.tokens.radius.pill,
                backgroundColor: isActive ? 'primary.main' : theme.tokens.surface.outlineStrong,
                transition: 'height 240ms cubic-bezier(0.22, 1, 0.36, 1), background-color 240ms',
                '&:focus-visible': {
                  outline: `2px solid ${theme.tokens.surface.outlineStrong}`,
                  outlineOffset: 4,
                },
              })}
            />
            <Typography
              variant="caption"
              component="span"
              className="slide-rail-label"
              aria-hidden="true"
              sx={(theme) => ({
                position: 'absolute',
                left: 'calc(100% + 10px)',
                top: '50%',
                transform: 'translateY(-50%)',
                whiteSpace: 'nowrap',
                px: 1,
                py: 0.5,
                borderRadius: `${theme.tokens.radius.sm}px`,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                color: 'text.primary',
                opacity: 0,
                pointerEvents: 'none',
                transition: 'opacity 160ms',
              })}
            >
              {label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default SlideProgressRail;
