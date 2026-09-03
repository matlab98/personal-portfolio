import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useTranslation } from 'react-i18next';

import { useAppTheme } from '@/context/ThemeContext';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useAppTheme();
  const { t } = useTranslation();

  const label = mode === 'dark' ? t('theme.to_light') : t('theme.to_dark');

  return (
    <Tooltip title={label}>
      <IconButton onClick={toggleTheme} color="inherit" aria-label={label}>
        {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
