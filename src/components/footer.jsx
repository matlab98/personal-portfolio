import React from 'react';
import styled from 'styled-components';

const StyeledCol = styled.span`
  text-align: center;
  margin-bottom: 2rem;
  @media (min-width: 570px) {
    margin-right: 5.3rem;
  }
`;

const Footer = ({ cel, social, loc }) => {
  return (
    <footer>
      <span className="copyright">
        Copyright &copy; {new Date().getFullYear()} Hilder Arrieta.
      </span>

      <StyeledCol mx={3}>
        Made with a lot of <i className="fas fa-heart"></i> by Hilder Arrieta
      </StyeledCol>
      <span className="location">{loc['city']}</span>
      <div className="footer-social">
        <a href={social['Facebook']}>
          <i className="fab fa-facebook-f"></i>
        </a>

        <a href={social['Linkedin']}>
          <i className="fab fa-linkedin"></i>
        </a>

        <a href={social['GitHub']}>
          <i className="fab fa-github"></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
