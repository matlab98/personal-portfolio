import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';

const Project = ({ project }) => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenDialog = (proj) => {
    setSelectedProject(proj);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProject(null);
  };

  const categories = [
    { id: 0, label: t('portfolio.categories.all'), type: "all", count: project?.length || 0 },
    { id: 1, label: t('portfolio.categories.frontend'), type: "FrontEnd", count: project?.filter(p => p.type === "FrontEnd").length || 0 },
    { id: 2, label: t('portfolio.categories.backend'), type: "BackEnd", count: project?.filter(p => p.type === "BackEnd").length || 0 },
    { id: 3, label: t('portfolio.categories.automation'), type: "Automation", count: project?.filter(p => p.type === "Automation").length || 0 },
    { id: 4, label: t('portfolio.categories.devops'), type: "Devops", count: project?.filter(p => p.type === "Devops").length || 0 }
  ];

  if (!project || !Array.isArray(project) || project.length === 0) {
    return null;
  }

  const filteredProjects = activeCategory === 'all'
    ? project
    : project.filter(p => p.type === activeCategory);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }} id="portfolio">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Typography variant="h2" component="h2" gutterBottom textAlign="center" color="primary">
          {t('portfolio.title')} 
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 4 }}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={`${category.label} (${category.count})`}
              onClick={() => setActiveCategory(category.type)}
              color={activeCategory === category.type ? 'primary' : 'default'}
              variant={activeCategory === category.type ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>

        <Grid container spacing={4}>
          {filteredProjects.map((proj, i) => (
            <Grid item key={i} xs={12} sm={6} md={4}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={proj.cover_page || 'https://via.placeholder.com/300x200?text=Project+Image'}
                    alt={proj.name_project}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h4">
                      {proj.name_project}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {proj.description?.substring(0, 100)}{proj.description?.length > 100 ? '...' : ''} 
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-around', borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button 
                      size="small" 
                      startIcon={<VisibilityIcon />} 
                      onClick={() => handleOpenDialog(proj)}
                    >
                      {t('portfolio.actions.viewDetails')}
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<LinkIcon />} 
                      href={proj.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      disabled={!proj.link}
                    >
                      {t('portfolio.actions.liveDemo')}
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

      </motion.div>

      {selectedProject && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="project-dialog-title"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="project-dialog-title">
            {selectedProject.name_project}
            <IconButton
              aria-label={t('portfolio.actions.close')}
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedProject.cover_page && (
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={selectedProject.cover_page} 
                  alt={selectedProject.name_project} 
                  style={{ maxHeight: '400px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }} 
                />
              </Box>
            )}
            <DialogContentText component="div">
              <Typography variant="body1" component="p" whiteSpace="pre-line">
                {selectedProject.description} 
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: '16px 24px' }}>
            <Button onClick={handleCloseDialog}>{t('portfolio.actions.close')}</Button>
            {selectedProject.link && (
                <Button 
                  variant="contained" 
                  href={selectedProject.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  startIcon={<LinkIcon />}
                >
                  {t('portfolio.actions.visitProject')}
                </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Project;
