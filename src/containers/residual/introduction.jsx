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
    </section>
  );
};

export default Introduction;
