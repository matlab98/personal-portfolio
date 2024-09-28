import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '@iconify/react';
import { faGithub, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import linkedinSquare from '@iconify-icons/fa/linkedin-square';
import { Col } from 'react-bootstrap';

const StyledCol = styled(Col)`
  margin: 15px 0; /* Combinado margen superior e inferior */
`;

const StyledA = styled.a`
  margin-bottom: 7px;
`;

const enlaces = [
  {
    href: 'https://github.com/matlab98',
    icon: <FontAwesomeIcon icon={faGithub} />,
  },
  {
    href: 'https://www.instagram.com/hilbrakaku/',
    icon: <FontAwesomeIcon icon={faInstagram} />,
  },
  {
    href: 'https://www.linkedin.com/in/hilbra-kaku',
    icon: <Icon icon={linkedinSquare} />,
  },
  {
    href: 'https://twitter.com/HilbraKaku',
    icon: <FontAwesomeIcon icon={faTwitter} />,
  },
];

const Contact = () => {
  return (
    <div className="contactside" style={{ color: 'black' }}>
      <StyledCol md={3} mx={4}>
        {enlaces.map((enlace, index) => (
          <Col key={index}>
            <StyledA href={enlace.href} target="_blank" rel="noopener noreferrer">
              {enlace.icon}
            </StyledA>
          </Col>
        ))}
      </StyledCol>
    </div>
  );
};

export default Contact;
