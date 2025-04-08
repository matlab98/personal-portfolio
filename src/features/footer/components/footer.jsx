import React from 'react';
import { useTranslation } from 'react-i18next';
import '../assets/style/style.css';
import { InstagramOutlined, GithubOutlined, LinkedinFilled } from '@ant-design/icons';


const Footer = ({ cel, social, loc }) => {
  const { t } = useTranslation();

  return (
    
    <footer>
  <div className="footer-content">
    <span className="footer-text">
      {t('footer.made_with')} <i className="fa fa-heart"></i> {t('footer.by')}. &copy; {new Date().getFullYear()}
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