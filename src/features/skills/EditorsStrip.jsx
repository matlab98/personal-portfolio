import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { formatSkillPercent } from '@/utils/skillsFromWakaTime';

/**
 * Tira de editores/IDE desde queryOne (WakaTime). Solo ítems con percent >= 1.
 */
const EditorsStrip = ({ editors, t, locale = 'en-US' }) => {
  const visible = (Array.isArray(editors) ? editors : [])
    .filter((item) => item?.name && item.percent >= 1)
    .slice(0, 6);

  if (visible.length === 0) return null;

  return (
    <Box sx={{ mt: { xs: 3.5, md: 5 } }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 1.25 }}>
        {t('skills.toolsTitle')}
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
        {visible.map((editor) => (
          <Chip
            key={editor.name}
            label={`${editor.name} ${formatSkillPercent(editor.percent, locale)} %`}
            size="small"
            variant="outlined"
            sx={(theme) => ({
              borderColor: theme.tokens.surface.outlineStrong,
              height: 32,
            })}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default EditorsStrip;
