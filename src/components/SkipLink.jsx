import Link from '@mui/material/Link';
import { useTranslation } from 'react-i18next';

/** Primer tabulador de la página: salta el navbar y va al contenido. */
const SkipLink = ({ targetId = 'main-content' }) => {
  const { t } = useTranslation();

  return (
    <Link
      href={`#${targetId}`}
      sx={(theme) => ({
        position: 'fixed',
        left: theme.spacing(2),
        top: theme.spacing(-10),
        zIndex: theme.zIndex.modal + 1,
        px: 2,
        py: 1.25,
        borderRadius: `${theme.tokens.radius.sm}px`,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        transition: `top 160ms ${theme.tokens.motion.cssEase}`,
        '&:focus-visible': { top: theme.spacing(2) },
      })}
    >
      {t('nav.skip_to_content')}
    </Link>
  );
};

export default SkipLink;
