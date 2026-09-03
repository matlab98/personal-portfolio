import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { LANGUAGES, findByRoute } from '@/config/languages';

const LanguageToggle = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);

  const current = findByRoute(lang);

  const handleSelect = (route) => {
    setAnchorEl(null);
    if (route !== current.route) navigate(`/${route}`);
  };

  return (
    <>
      <Button
        color="inherit"
        size="small"
        startIcon={<TranslateRoundedIcon />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-label={t('nav.language')}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
        sx={{ minWidth: 0 }}
      >
        {current.short}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{ list: { 'aria-label': t('nav.language') } }}
      >
        {LANGUAGES.map((language) => (
          <MenuItem
            key={language.route}
            selected={language.route === current.route}
            onClick={() => handleSelect(language.route)}
          >
            {t(language.labelKey)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageToggle;
