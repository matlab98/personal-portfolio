import { useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import emailjs from '@emailjs/browser';
import { useTranslation } from 'react-i18next';

import { emailKey } from '@/config/config';
import { scrollToSection, scrollToTop } from '@/utils/scroll';

const Marquee = ({ text }) => (
  <Box
    aria-hidden="true"
    sx={{
      overflow: 'hidden',
      borderBlock: '1px solid',
      borderColor: 'divider',
      py: { xs: 1.75, md: 2.25 },
      my: { xs: 3.5, md: 5 },
      '@media (prefers-reduced-motion: reduce)': {
        '& .marquee-track': { animation: 'none' },
      },
      '&:hover .marquee-track': {
        animationPlayState: 'paused',
      },
    }}
  >
    <Box
      className="marquee-track"
      sx={{
        display: 'flex',
        width: 'max-content',
        animation: 'marquee 22s linear infinite',
        '@keyframes marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      }}
    >
      {[0, 1].map((copy) => (
        <Typography
          key={copy}
          variant="h2"
          component="span"
          sx={{
            fontSize: 'clamp(2rem, 1rem + 4vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: 'text.disabled',
            whiteSpace: 'nowrap',
            px: 4,
          }}
        >
          {text} ·{' '}
        </Typography>
      ))}
    </Box>
  </Box>
);

/** Diapositiva de cierre: contacto directo + formulario EmailJS + footer.
 * Privacidad: no acepta ni renderiza teléfono ni ubicación (props legacy ignoradas).
 */
const Touch = ({ email, social }) => {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [honeypot, setHoneypot] = useState('');

  const isConfigured = Boolean(emailKey.serviceId && emailKey.templateId && emailKey.userId);
  const recipient = Array.isArray(email) ? email.find(Boolean) : email;

  const resolvedSocial = [];
  const xUrl = social?.X || social?.Twitter;
  if (xUrl) {
    resolvedSocial.push({ field: 'X', label: 'X', Icon: AlternateEmailRoundedIcon, url: xUrl });
  }
  if (social?.Linkedin) {
    resolvedSocial.push({
      field: 'Linkedin',
      label: 'LinkedIn',
      Icon: LinkedInIcon,
      url: social.Linkedin,
    });
  }
  if (social?.GitHub) {
    resolvedSocial.push({ field: 'GitHub', label: 'GitHub', Icon: GitHubIcon, url: social.GitHub });
  }

  const sendEmail = (event) => {
    event.preventDefault();
    if (status === 'loading' || honeypot) return;

    if (!isConfigured) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    emailjs
      .sendForm(emailKey.serviceId, emailKey.templateId, formRef.current, emailKey.userId)
      .then(
        () => {
          setStatus('ok');
          formRef.current?.reset();
        },
        (error) => {
          console.error('EmailJS sendForm failed:', error?.text || error?.message);
          setStatus('error');
        },
      );
  };

  const isSending = status === 'loading';
  const year = new Date().getFullYear();

  return (
    <Box aria-labelledby="closing-heading">
      <Typography
        id="closing-heading"
        variant="h1"
        component="h2"
        sx={{
          fontSize: 'clamp(2.5rem, 1.45rem + 4.8vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          textWrap: 'balance',
          mb: 1.25,
        }}
      >
        <Box component="span" sx={{ display: 'block' }}>
          {t('closing.title_line1')}
        </Box>
        <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
          {t('closing.title_line2')}
        </Box>
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={(theme) => ({
          mb: { xs: 3.5, md: 5 },
          maxWidth: theme.tokens.layout.leadMaxWidth,
          lineHeight: 1.65,
        })}
      >
        {t('closing.availability')}
      </Typography>

      <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="overline" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            {t('closing.direct')}
          </Typography>

          <Stack spacing={3}>
            {recipient && (
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  {t('closing.email_label')}
                </Typography>
                <Typography variant="h5" component="p" sx={{ wordBreak: 'break-word' }}>
                  <Link href={`mailto:${recipient}`} color="inherit" underline="hover">
                    {recipient}
                  </Link>
                </Typography>
              </Box>
            )}

            {resolvedSocial.length > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1.25, display: 'block' }}>
                  {t('closing.social_label')}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {resolvedSocial.map(({ field, label, Icon, url }) => (
                    <IconButton
                      key={field}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      sx={{
                        color: 'primary.contrastText',
                        backgroundColor: 'primary.main',
                        width: 44,
                        height: 44,
                        '&:hover': { backgroundColor: 'primary.dark' },
                      }}
                    >
                      <Icon fontSize="small" />
                    </IconButton>
                  ))}
                </Stack>
              </Box>
            )}

            <Button
              variant="outlined"
              href="#portfolio"
              onClick={(event) => {
                event.preventDefault();
                if (!scrollToSection('portfolio')) {
                  scrollToSection('skills');
                }
              }}
              sx={{ alignSelf: 'flex-start' }}
            >
              {t('hero.cta_work')}
            </Button>
          </Stack>
        </Grid>

        {recipient && (
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={(theme) => ({
                p: { xs: 0, md: 3.5 },
                borderRadius: { md: `${theme.tokens.radius.lg}px` },
                border: { md: '1px solid' },
                borderColor: { md: 'divider' },
                backgroundColor: { md: 'background.paper' },
              })}
            >
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ mb: 2.5, display: 'block' }}
              >
                {t('closing.form_title')}
              </Typography>

              <Box component="form" ref={formRef} onSubmit={sendEmail} noValidate={false}>
                <input type="hidden" name="who" value={recipient ?? ''} readOnly />
                <Box
                  component="input"
                  name="_gotcha"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                  tabIndex={-1}
                  aria-hidden="true"
                  autoComplete="off"
                  sx={{
                    position: 'absolute',
                    left: -9999,
                    width: 1,
                    height: 1,
                    opacity: 0,
                  }}
                />

                <Stack spacing={2.5}>
                  <TextField name="name" label={t('contact.name')} autoComplete="name" required fullWidth />
                  <TextField
                    name="email"
                    type="email"
                    label={t('contact.email')}
                    autoComplete="email"
                    required
                    fullWidth
                  />
                  <TextField
                    name="message"
                    label={t('contact.message')}
                    multiline
                    minRows={4}
                    required
                    fullWidth
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSending}
                    startIcon={
                      isSending ? (
                        <CircularProgress size={18} color="inherit" aria-hidden="true" />
                      ) : (
                        <SendRoundedIcon />
                      )
                    }
                    sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
                  >
                    {isSending ? t('common.loading') : t('contact.submit')}
                  </Button>

                  <Box aria-live="polite">
                    {status === 'ok' && <Alert severity="success">{t('contact.success')}</Alert>}
                    {status === 'error' && <Alert severity="error">{t('contact.error')}</Alert>}
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>

      <Marquee text={t('closing.marquee')} />

      <Box
        component="footer"
        data-qa="site-footer"
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          pt: { xs: 2.5, md: 3 },
          mt: { xs: 1, md: 2 },
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1.5, sm: 2 }}
          alignItems="center"
          justifyContent="space-between"
          textAlign={{ xs: 'center', sm: 'left' }}
        >
          <Typography variant="caption" color="text.secondary">
            {t('footer.rights', { year })} · {t('footer.made_with')} ❤️ {t('footer.by')}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
            justifyContent="center"
            useFlexGap
          >
            <Typography variant="caption" color="text.secondary">
              {t('footer.built_with')}
            </Typography>
            <Link
              href="https://github.com/hilbrakaku/personal-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              variant="caption"
            >
              {t('footer.source_code')}
            </Link>
          </Stack>

          <Button
            variant="text"
            size="small"
            onClick={(event) => {
              event.preventDefault();
              scrollToTop();
            }}
            startIcon={<ArrowUpwardRoundedIcon />}
          >
            {t('footer.back_to_top')}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Touch;
