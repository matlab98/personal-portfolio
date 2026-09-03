import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import { useTranslation } from 'react-i18next';

import LanguageToggle from '@/components/LanguageToggle';
import SlideIndex from '@/components/SlideIndex';
import ThemeToggle from '@/components/ThemeToggle';
import useActiveSection from '@/hooks/useActiveSection';
import { scrollToTop } from '@/utils/scroll';

/**
 * Barra fija: marca + idioma + tema + índice. Sin links inline ni drawer.
 *
 * @param {{ id: string, labelKey?: string }[]} sections
 * @param {{ email?: string, social?: object }} [contact]
 */
const Navbar = ({ sections = [], contact }) => {
  const { t } = useTranslation();
  const [indexOpen, setIndexOpen] = useState(false);

  const sectionIds = sections.map((section) => section.id).filter(Boolean);
  useActiveSection(sectionIds);

  const handleBrandClick = (event) => {
    event.preventDefault();
    setIndexOpen(false);
    scrollToTop();
  };

  return (
    <>
      <AppBar
        position="fixed"
        component="header"
        data-qa="navbar"
        sx={(theme) => ({
          height: theme.tokens.layout.headerHeight,
          backgroundColor: `${theme.palette.background.paper}D1`,
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
        })}
      >
        <Toolbar
          sx={(theme) => ({
            gap: 1,
            minHeight: theme.tokens.layout.headerHeight,
            px: { xs: 1.5, sm: 2, md: 3 },
          })}
        >
          <Typography variant="h6" component="p" sx={{ flex: 1, minWidth: 0 }}>
            <Box
              component="a"
              href="#"
              onClick={handleBrandClick}
              aria-label={t('nav.back_to_top')}
              sx={(theme) => ({
                color: 'inherit',
                textDecoration: 'none',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                '&:focus-visible': {
                  outline: `2px solid ${theme.tokens.surface.outlineStrong}`,
                  outlineOffset: 2,
                  borderRadius: `${theme.tokens.radius.sm}px`,
                },
              })}
            >
              {t('nav.brand')}
            </Box>
          </Typography>

          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
            <LanguageToggle />
            <ThemeToggle />
            {sections.length > 0 && (
              <Button
                color="inherit"
                startIcon={<MenuBookRoundedIcon />}
                onClick={() => setIndexOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={indexOpen}
                aria-controls="slide-index-title"
                sx={(theme) => ({
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'inline-flex' },
                  '&:focus-visible': {
                    outline: `2px solid ${theme.tokens.surface.outlineStrong}`,
                    outlineOffset: 2,
                  },
                })}
              >
                {t('nav.index')}
              </Button>
            )}
            {sections.length > 0 && (
              <Button
                color="inherit"
                onClick={() => setIndexOpen(true)}
                aria-label={t('nav.index')}
                aria-haspopup="dialog"
                aria-expanded={indexOpen}
                aria-controls="slide-index-title"
                sx={(theme) => ({
                  minWidth: theme.tokens.layout.touchTarget,
                  px: 1,
                  display: { xs: 'inline-flex', sm: 'none' },
                  '&:focus-visible': {
                    outline: `2px solid ${theme.tokens.surface.outlineStrong}`,
                    outlineOffset: 2,
                  },
                })}
              >
                <MenuBookRoundedIcon />
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      <SlideIndex
        open={indexOpen}
        onClose={() => setIndexOpen(false)}
        sections={sections}
        contact={contact}
      />
    </>
  );
};

export default Navbar;
