import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import { useTranslation } from 'react-i18next';

import MotionReveal from '@/components/MotionReveal';
import SectionHeading from '@/components/SectionHeading';
import useReducedMotion from '@/hooks/useReducedMotion';
import ProjectCarousel from '@/features/portfolio/ProjectCarousel';

const CATEGORY_TYPES = [
  { type: 'FrontEnd', labelKey: 'portfolio.categories.frontend' },
  { type: 'BackEnd', labelKey: 'portfolio.categories.backend' },
  { type: 'Automation', labelKey: 'portfolio.categories.automation' },
  { type: 'Devops', labelKey: 'portfolio.categories.devops' },
];

const Project = ({ project }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const reducedMotion = useReducedMotion();

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = useMemo(() => (Array.isArray(project) ? project : []), [project]);

  const categories = useMemo(() => {
    const withCount = CATEGORY_TYPES.map(({ type, labelKey }) => ({
      type,
      label: t(labelKey),
      count: projects.filter((item) => item?.type === type).length,
    })).filter(({ count }) => count > 0);

    return [
      { type: 'all', label: t('portfolio.categories.all'), count: projects.length },
      ...withCount,
    ];
  }, [projects, t]);

  const filteredProjects = useMemo(
    () =>
      activeCategory === 'all'
        ? projects
        : projects.filter((item) => item?.type === activeCategory),
    [activeCategory, projects],
  );

  const handleCategoryChange = (type) => {
    setActiveCategory(type);
    requestAnimationFrame(() => {
      const track = document.querySelector('[data-portfolio-track]');
      track?.scrollTo({ left: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  };

  if (projects.length === 0) return null;

  const handleCloseDialog = () => setSelectedProject(null);

  return (
    <>
      <SectionHeading title={t('portfolio.title')} subtitle={t('portfolio.subtitle')} />

      {categories.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          role="group"
          aria-label={t('portfolio.filters_label')}
          sx={{
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: { xs: 'flex-start', md: 'center' },
            mb: { xs: 2.5, md: 3.5 },
          }}
        >
          {categories.map((category) => {
            const isActive = activeCategory === category.type;
            return (
              <Chip
                key={category.type}
                component="button"
                type="button"
                label={`${category.label} (${category.count})`}
                onClick={() => handleCategoryChange(category.type)}
                color={isActive ? 'primary' : 'default'}
                variant={isActive ? 'filled' : 'outlined'}
                aria-pressed={isActive}
                sx={(chipTheme) => ({
                  cursor: 'pointer',
                  height: 36,
                  borderColor: isActive ? 'primary.main' : chipTheme.tokens.surface.outlineStrong,
                })}
              />
            );
          })}
        </Stack>
      )}

      <Box
        component="span"
        aria-live="polite"
        sx={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {t('portfolio.results', { count: filteredProjects.length })}
      </Box>

      {filteredProjects.length === 0 ? (
        <Stack spacing={2} alignItems="flex-start">
          <Typography color="text.secondary">{t('portfolio.empty_filter')}</Typography>
          <Button variant="outlined" onClick={() => handleCategoryChange('all')}>
            {t('portfolio.show_all')}
          </Button>
        </Stack>
      ) : (
        <MotionReveal key={activeCategory}>
          <ProjectCarousel projects={filteredProjects} onViewDetails={setSelectedProject} />
        </MotionReveal>
      )}

      <Dialog
        open={Boolean(selectedProject)}
        onClose={handleCloseDialog}
        aria-labelledby="project-dialog-title"
        maxWidth="md"
        fullWidth
        fullScreen={isSmallScreen}
      >
        <DialogTitle id="project-dialog-title" sx={{ pr: 7 }}>
          {selectedProject?.name_project}
          <IconButton
            aria-label={t('portfolio.actions.close')}
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {selectedProject?.cover_page && (
            <Box
              component="img"
              src={selectedProject.cover_page}
              alt={selectedProject?.name_project ?? ''}
              sx={(dialogTheme) => ({
                display: 'block',
                width: '100%',
                maxHeight: { xs: 220, md: 380 },
                objectFit: 'contain',
                mb: 2,
                borderRadius: `${dialogTheme.tokens.radius.md}px`,
              })}
            />
          )}
          <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
            {selectedProject?.description}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: 'wrap' }}>
          <Button onClick={handleCloseDialog}>{t('portfolio.actions.close')}</Button>
          {selectedProject?.link && (
            <Button
              variant="contained"
              href={selectedProject.link}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<LaunchRoundedIcon />}
            >
              {t('portfolio.actions.visitProject')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Project;
