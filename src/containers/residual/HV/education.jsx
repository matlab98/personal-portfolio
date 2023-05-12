import React from 'react';

function Education(props) {
  return (
    <section id="my-timeline" className="section clearfix format-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12">
            <div className="heading">
              <strong className="sect-title">
                <span>Trabajo & </span>educación
                <i className="heading-logo margin-logo fa fa-history"></i>
              </strong>
              <p>
                Esta es mi formación profesional hasta hoy.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="timeline">
              {props['education'].map((a, i) => {
                return (
                  <div className="timeline-row" key={i}>
                    <div className="timeline-time">
                      <small>{a.date}</small>
                    </div>
                    <div className="timeline-dot sea-green-bg"></div>
                    <div className="timeline-content sea-green">
                      <img
                        className="fa-timeline"
                        alt=""
                        src="https://res.cloudinary.com/dpykpv9hd/image/upload/v1630360986/i9usampbfu6yzyaj1z1w.png"
                      />
                      <h4>{a.institution_name}</h4>
                      <p className="description">{a.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Education;
