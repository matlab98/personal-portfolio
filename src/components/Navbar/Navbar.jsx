import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Nombres de las secciones y sus IDs correspondientes para los enlaces de navegación
  const sections = [
    { title: t('nav.introduction'), id: 'introduction' },
    { title: t('nav.resume'), id: 'resume' },
    { title: t('nav.services'), id: 'services' },
    { title: t('nav.portfolio'), id: 'portfolio' },
    { title: t('nav.statistics'), id: 'statistics' },
    { title: t('nav.contact'), id: 'contact' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleScrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false); // Cerrar drawer después de hacer clic
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {sections.map((section) => (
          <ListItem key={section.id} disablePadding>
            <ListItemButton 
              onClick={() => handleScrollToSection(section.id)}
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary={section.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed" component="nav">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Brand (left) */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flex: { xs: '1 1 auto', md: '0 0 auto' } }}
        >
          <a 
            href="#" 
            onClick={(e) => { 
              e.preventDefault(); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {t('nav.brand')}
          </a>
        </Typography>

        {/* Desktop Navigation: tabs centered */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            flex: '1 1 auto',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {sections.map((section) => (
            <Button
              key={section.id}
              color="inherit"
              onClick={() => handleScrollToSection(section.id)}
              sx={{ textTransform: 'none' }}
            >
              {section.title}
            </Button>
          ))}
        </Box>

        {/* Desktop right actions */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          <ThemeToggle />
        </Box>

        {/* Mobile Navigation */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
          <ThemeToggle />
          <IconButton 
            color="inherit" 
            aria-label="open drawer" 
            edge="start" 
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
      
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 