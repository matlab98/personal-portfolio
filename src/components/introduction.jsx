import React from 'react';

const Introduction = (props) => {
  return (
    <section id="introduction" className="format-section">
      <div className="heading" data-aos="fade">
        <strong>¿Quién soy?</strong>
        <p>{props.intro['Description']}</p>
      </div>
      <div className="model-bg">
        <img
          data-aos="fade"
          data-aos-duration="3000"
          src="https://res.cloudinary.com/dpykpv9hd/image/upload/v1628389307/ieol3g7js4u9m5vwf7wx.svg"
          alt=""
        />
      </div>
      <div className="intro-video" data-aos="fade-up">
        <iframe
          width="560"
          height="315"
          src={props.intro['link']}
          title="Introducción"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
};

export default Introduction;
