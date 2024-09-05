import React from 'react';

const service = (props) => {
  return (
    <section id="services" className="format-section">
      <div className="row">
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="heading">
            <strong className="sect-title">
              <span>Servicios</span>
              <i className="heading-logo service-logo"></i>
            </strong>
            <p>Estos son mis servicios.</p>
          </div>
        </div>
      </div>

      <div className="services-box-container">
        {props['service'].map((a, i) => {
          return (
            <div className="service-box" key={i} data-aos="fade-up">
              <i className={a.icon}></i>
              <strong>{a.service}</strong>
              <p>{a.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default service;
