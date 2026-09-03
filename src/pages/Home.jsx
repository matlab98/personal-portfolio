import React, { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import LazySectionWrapper from '@/components/LazySectionWrapper';
import Navbar from '@/components/Navbar/Navbar';
import Slide from '@/components/Slide';
import SlideHeader from '@/components/SlideHeader';
import SlideProgressBar from '@/components/SlideProgressBar';
import SlideProgressRail from '@/components/SlideProgressRail';
import SlideViewport from '@/components/SlideViewport';
import SkipLink from '@/components/SkipLink';
import ServicesMetricsSection from '@/containers/ServicesMetricsSection';
import Hero from '@/features/main/Dash';
import { resolveAnchor, scrollToSection } from '@/utils/scroll';

const Introduction = React.lazy(() => import('@/features/intro/introduction'));
const Education = React.lazy(() => import('@/features/resume/Education'));
const Portfolio = React.lazy(() => import('@/features/portfolio/project'));
const SkillsList = React.lazy(() => import('@/features/skills/SkillsList'));
const Touch = React.lazy(() => import('@/features/touch/Touch'));

/**
 * Vista general del portafolio: orden, anclas, riel e índice comparten la misma lista.
 *
 * Diapositivas (§DISENO-SLIDES §2):
 * 1 hero (sin id) · 2 introduction · 3 services · 4 skills · 5 portfolio · 6 resume · 7 contact
 *
 * fit: desktop (≥ md) — `contain` cabe en 100dvh; trayectoria `scroll` con región interna.
 * fit: móvil/tableta — altura natural, scroll continuo del documento (sin snap).
 */
const Home = ({ data }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSlideMode = useMediaQuery(theme.breakpoints.up('md'));

  const slides = useMemo(
    () =>
      [
        {
          id: 'introduction',
          labelKey: 'nav.about',
          fit: 'contain',
          skeleton: 'text',
          content: <Introduction intro={data?.introduction} />,
        },
        {
          id: 'services',
          labelKey: 'nav.services',
          fit: 'contain',
          skeleton: 'cards',
          content: <ServicesMetricsSection service={data?.services} />,
        },
        {
          id: 'skills',
          labelKey: 'nav.skills',
          fit: 'contain',
          skeleton: 'skills',
          content: <SkillsList />,
        },
        data?.portfolio && {
          id: 'portfolio',
          labelKey: 'nav.portfolio',
          fit: 'contain',
          skeleton: 'carousel',
          content: <Portfolio project={data.portfolio} />,
        },
        data?.education && {
          id: 'resume',
          labelKey: 'nav.resume',
          fit: isSlideMode ? 'scroll' : 'contain',
          skeleton: 'timeline',
          scrollAriaLabel: t('education.scroll_hint'),
          headerTitleKey: 'education.title',
          headerSubtitleKey: 'education.subtitle',
          content: <Education education={data.education} hideHeader />,
        },
        {
          id: 'contact',
          labelKey: 'nav.closing',
          fit: 'contain',
          skeleton: 'form',
          labelledBy: 'closing-heading',
          content: (
            <Touch email={data?.email} social={data?.socialN} />
          ),
        },
      ].filter(Boolean),
    [data, isSlideMode, t],
  );

  useEffect(() => {
    const raw = window.location.hash.replace(/^#/, '');
    if (!raw) return undefined;

    const id = resolveAnchor(raw);
    const timer = window.requestAnimationFrame(() => {
      scrollToSection(id);
    });

    return () => window.cancelAnimationFrame(timer);
  }, []);

  const sectionIds = slides.map((slide) => slide.id);
  const navSections = slides.map(({ id, labelKey }) => ({ id, labelKey }));
  const contactEmail = Array.isArray(data?.email)
    ? data.email.find(Boolean)
    : data?.email;
  const contact = {
    email: contactEmail,
    social: data?.socialN,
  };

  const formatOverline = (index, label) =>
    `${String(index + 1).padStart(2, '0')} — ${label}`;

  return (
    <Box sx={{ backgroundColor: 'background.default', color: 'text.primary' }}>
      <SkipLink />
      <SlideProgressBar sectionIds={sectionIds} />
      <SlideProgressRail sections={navSections} />
      <Navbar sections={navSections} contact={contact} />
      <Toolbar aria-hidden="true" />

      <SlideViewport>
        <Slide variant="hero" fit="contain">
          <LazySectionWrapper skeleton="hero" fullSlide={isSlideMode}>
            <Hero resume={data?.resume} cv={data?.CV} />
          </LazySectionWrapper>
        </Slide>

        {slides.map((slide, index) => {
          const label = t(slide.labelKey);
          const overline = formatOverline(index, label);

          const header =
            slide.headerTitleKey != null ? (
              <SlideHeader
                overline={overline}
                title={t(slide.headerTitleKey)}
                subtitle={
                  slide.headerSubtitleKey ? t(slide.headerSubtitleKey) : undefined
                }
                titleId={`${slide.id}-heading`}
              />
            ) : null;

          const content = slide.content;

          return (
            <Slide
              key={slide.id}
              id={slide.id}
              fit={slide.fit}
              variant={index % 2 === 0 ? 'alt' : 'default'}
              header={header}
              scrollAriaLabel={slide.scrollAriaLabel}
              labelledBy={
                slide.labelledBy ??
                (slide.headerTitleKey ? `${slide.id}-heading` : undefined)
              }
            >
              <LazySectionWrapper skeleton={slide.skeleton} fullSlide={isSlideMode}>
                {content}
              </LazySectionWrapper>
            </Slide>
          );
        })}
      </SlideViewport>
    </Box>
  );
};

export default Home;
