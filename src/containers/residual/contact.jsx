import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '@iconify/react';
import {
  faGithub,
  faInstagram,
  faFacebook,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import linkedinSquare from '@iconify-icons/fa/linkedin-square';
import { Col } from 'react-bootstrap';

const StyledCol = styled(Col)`
  margin-top: 15px;
  margin-bottom: 15px;
`;

const StyledA = styled.a`
  margin-bottom: 7px;
`;

const contact = () => {
  return (
    <div className="contactside" style={{ color: 'black' }}>
      <StyledCol md={3} mx={4}>
        <Col>
          <StyledA href="https://github.com/matlab98" target="_blank">
            <FontAwesomeIcon
              className="contactIcon"
              icon={faGithub}
              style={{ color: 'black' }}
            />
          </StyledA>
        </Col>
        <Col>
          <StyledA
            href="https://www.instagram.com/hilbrakaku/"
            target="_blank"
            id="profile-link"
          >
            <FontAwesomeIcon
              className="contactIcon"
              icon={faInstagram}
              style={{ color: 'black' }}
            />
          </StyledA>
        </Col>
        <Col>
          <StyledA href="https://www.facebook.com/Hildera/" target="_blank">
            <FontAwesomeIcon
              className="contactIcon"
              icon={faFacebook}
              style={{ color: 'black' }}
            />
          </StyledA>
        </Col>
        <Col>
          <StyledA
            href="https://www.linkedin.com/in/hilbra-kaku"
            target="_blank"
          >
            <Icon
              className="contactIcon"
              icon={linkedinSquare}
              style={{ color: 'black' }}
            />
          </StyledA>
        </Col>
        <Col>
          <StyledA href="https://twitter.com/HilbraKaku" target="_blank">
            <FontAwesomeIcon
              className="contactIcon"
              icon={faTwitter}
              style={{ color: 'black' }}
            />
          </StyledA>
        </Col>
      </StyledCol>
    </div>
  );
};

export default contact;
