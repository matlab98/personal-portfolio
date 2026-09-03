import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useTranslation } from 'react-i18next';

const DESCRIPTION_PREVIEW_LENGTH = 120;

const ProjectCard = ({ item, index, onViewDetails }) => {
  const { t } = useTranslation();

  return (
    <Card
      data-carousel-card
      data-carousel-index={index}
      sx={(theme) => ({
        flex: '0 0 var(--app-carousel-card, min(78vw, 320px))',
        scrollSnapAlign: { xs: 'center', md: 'start' },
        width: 'var(--app-carousel-card, min(78vw, 320px))',
        minHeight: { xs: 300, md: 340 },
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        transition: `box-shadow 220ms ${theme.tokens.motion.cssEase}, border-color 220ms ${theme.tokens.motion.cssEase}, transform 220ms ${theme.tokens.motion.cssEase}`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': {
            boxShadow: theme.tokens.elevation.md,
            borderColor: 'primary.main',
            transform: 'translateY(-2px)',
          },
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '@media (hover: hover) and (pointer: fine)': {
            '&:hover': { transform: 'none' },
          },
        },
      })}
    >
      {item?.cover_page ? (
        <CardMedia
          component="img"
          image={item.cover_page}
          alt={item?.name_project ?? ''}
          loading="lazy"
          sx={{
            aspectRatio: '16 / 9',
            objectFit: 'cover',
            backgroundColor: 'action.hover',
          }}
        />
      ) : (
        <Box
          aria-hidden="true"
          sx={(theme) => ({
            aspectRatio: '16 / 9',
            background: theme.tokens.surface.heroGradient,
            borderBottom: '1px solid',
            borderColor: 'divider',
          })}
        />
      )}

      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: { xs: 2, md: 2.5 },
          '&:last-child': { pb: { xs: 2, md: 2.5 } },
        }}
      >
        <Typography variant="h5" component="h3" sx={{ textWrap: 'balance' }}>
          {item?.name_project}
        </Typography>
        {item?.description && (
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {item.description.slice(0, DESCRIPTION_PREVIEW_LENGTH)}
            {item.description.length > DESCRIPTION_PREVIEW_LENGTH ? '…' : ''}
          </Typography>
        )}
      </CardContent>

      <CardActions
        sx={{
          p: { xs: 1.5, md: 2 },
          gap: 1,
          flexWrap: 'wrap',
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: 'auto',
        }}
      >
        <Button size="small" startIcon={<VisibilityRoundedIcon />} onClick={() => onViewDetails(item)}>
          {t('portfolio.actions.viewDetails')}
        </Button>
        {item?.link && (
          <Button
            size="small"
            startIcon={<LaunchRoundedIcon />}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t('portfolio.actions.liveDemo')}: ${item?.name_project ?? ''}`}
          >
            {t('portfolio.actions.liveDemo')}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
