import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';

import createAppTheme from '@/config/createAppTheme';
import { layout } from '@/config/tokens';
import Slide from '@/components/Slide';
import Touch from '@/features/touch/Touch';
import i18n from '@/i18n';
import { I18nextProvider } from 'react-i18next';

const theme = createAppTheme('light');
const cssBaseline = theme.components.MuiCssBaseline.styleOverrides;

const renderWithProviders = (ui) =>
  render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </I18nextProvider>,
  );

describe('contrato de layout por breakpoint', () => {
  it('scroll-snap del documento solo en desktop (≥ md)', () => {
    const htmlStyles = cssBaseline.html;
    expect(htmlStyles.scrollSnapType).toBeUndefined();
    expect(htmlStyles[`@media (min-width:900px)`].scrollSnapType).toBe('y mandatory');
  });

  it('diapositivas usan 100dvh y snap solo en desktop', () => {
    const slideStyles = cssBaseline['.slide'];
    expect(slideStyles.minHeight).toBe('auto');
    expect(slideStyles[`@media (min-width:900px)`].minHeight).toBe(layout.slideMinHeight);
    expect(slideStyles[`@media (min-width:900px)`].scrollSnapAlign).toBe('start');
  });

  it('trayectoria aplana scroll interno en móvil', () => {
    const bodyStyles = cssBaseline['.slide--scroll .slide__body'];
    expect(bodyStyles[`@media (max-width:899px)`].overflowY).toBe('visible');
  });

  it('Slide expone clases fit contain y scroll', () => {
    const { container: containEl } = renderWithProviders(
      <Slide id="test-contain" fit="contain">
        contenido
      </Slide>,
    );
    expect(containEl.querySelector('section')).toHaveClass('slide--contain');

    const { container: scrollEl } = renderWithProviders(
      <Slide id="test-scroll" fit="scroll" scrollAriaLabel="lista">
        contenido
      </Slide>,
    );
    expect(scrollEl.querySelector('section')).toHaveClass('slide--scroll');
    expect(scrollEl.querySelector('.slide__body')).toBeTruthy();
  });
});

describe('privacidad en contacto', () => {
  it('Touch no muestra teléfono ni ubicación aunque lleguen en props legacy', () => {
    renderWithProviders(
      <Touch
        email="hola@ejemplo.com"
        cel="+57 300 000 0000"
        loc={{ city: 'Bogotá', country: 'Colombia' }}
        social={{ GitHub: 'https://github.com/test' }}
      />,
    );

    expect(screen.queryByText('+57 300 000 0000')).not.toBeInTheDocument();
    expect(screen.queryByText(/Bogotá/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Colombia/)).not.toBeInTheDocument();
    expect(screen.getByText('hola@ejemplo.com')).toBeInTheDocument();
  });

  it('footer incluye copy made_with / by vía i18n', async () => {
    await i18n.changeLanguage('es-CO');
    renderWithProviders(
      <Touch email="hola@ejemplo.com" social={{ GitHub: 'https://github.com/test' }} />,
    );

    expect(screen.getByText(/Hecho con amor/)).toBeInTheDocument();
    expect(screen.getByText(/por mí/)).toBeInTheDocument();
    await i18n.changeLanguage('en-US');
  });
});

describe('marcadores de layout en DOM', () => {
  it('navbar y carrusel usan atributos esperados para smoke QA', () => {
    const { container } = renderWithProviders(
      <>
        <header role="banner" data-qa="navbar">
          nav
        </header>
        <main id="main-content">
          <section className="slide slide--contain" id="portfolio">
            <div data-portfolio-track role="group" />
          </section>
          <footer data-qa="site-footer">fin</footer>
        </main>
      </>,
    );

    expect(container.querySelector('[data-qa="navbar"]')).toBeTruthy();
    expect(container.querySelector('#main-content')).toBeTruthy();
    expect(container.querySelector('[data-portfolio-track]')).toBeTruthy();
    expect(container.querySelector('[data-qa="site-footer"]')).toBeTruthy();
    expect(container.querySelector('#portfolio.slide--contain')).toBeTruthy();
  });
});
