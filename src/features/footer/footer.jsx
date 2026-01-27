import React from 'react';
import { useTranslation } from 'react-i18next';
import './styles.css';
import { InstagramOutlined, GithubOutlined, LinkedinFilled } from '@ant-design/icons';


const Footer = ({ cel, social, loc }) => {
  const { t } = useTranslation();

  return (
    <footer>
      <div className="footer-content">
        <span className="footer-text">
          {t('footer.made_with')} ❤️ {t('footer.by')}. &copy; {new Date().getFullYear()}
        </span>

        {social && (
          <div className="footer-social">
            {social['Facebook'] && (
              <a href={social['Facebook']} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <InstagramOutlined />
              </a>
            )}
            {social['Linkedin'] && (
              <a href={social['Linkedin']} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <LinkedinFilled />
              </a>
            )}
            {social['GitHub'] && (
              <a href={social['GitHub']} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <GithubOutlined />
              </a>
            )}
          </div>
        )}

        {loc && (
          <span className="location">
            {loc.city && `${loc.city}`}
            {loc.country && loc.city && `, `}
            {loc.country && `${loc.country}`}
          </span>
        )}
      </div>
    </footer>
  );
};

export default Footer;
{/* <footer>
      <span className="copyright">
      </span>

      <span className="footer-text">
        {t('footer.made_with')} <i className="fa fa-heart"></i> {t('footer.by')}. &copy; {new Date().getFullYear()}
      </span>

      {/* <span className="location">
        {loc['city']}
      </span> 

      <div className="footer-social">
        <a href={social['Facebook']} aria-label="Instagram">
          <InstagramOutlined />
        </a>
        <a href={social['Linkedin']} aria-label="LinkedIn">
          <LinkedinFilled />
        </a>
        <a href={social['GitHub']} aria-label="GitHub">
          <GithubOutlined />
        </a>
      </div>
    </footer> */}