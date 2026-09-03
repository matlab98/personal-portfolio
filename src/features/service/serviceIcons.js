import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import BrushRoundedIcon from '@mui/icons-material/BrushRounded';
import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded';
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';

/**
 * El CMS guarda el icono como clase de FontAwesome ("fa fa-code"), pero
 * FontAwesome ya no se carga. Traducimos esa clase a un icono de MUI por
 * palabra clave y caemos a un genérico si no reconocemos nada.
 */
const ICON_RULES = [
  { match: ['brush', 'paint', 'palette', 'design', 'ux', 'ui', 'pencil'], Icon: BrushRoundedIcon },
  { match: ['mobile', 'phone', 'android', 'apple', 'tablet'], Icon: PhoneIphoneRoundedIcon },
  { match: ['cloud', 'docker', 'server', 'devops', 'aws'], Icon: CloudRoundedIcon },
  { match: ['database', 'data', 'sql', 'storage', 'backend', 'back-end'], Icon: StorageRoundedIcon },
  { match: ['bug', 'test', 'qa', 'check', 'shield'], Icon: BugReportRoundedIcon },
  { match: ['code', 'laptop', 'desktop', 'web', 'html', 'terminal'], Icon: CodeRoundedIcon },
];

const resolveServiceIcon = (iconClass) => {
  const normalized = typeof iconClass === 'string' ? iconClass.toLowerCase() : '';
  const rule = ICON_RULES.find(({ match }) => match.some((keyword) => normalized.includes(keyword)));
  return rule?.Icon ?? AutoAwesomeRoundedIcon;
};

export default resolveServiceIcon;
