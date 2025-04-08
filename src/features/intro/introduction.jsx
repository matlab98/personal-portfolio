import React from 'react';

const Introduction = (props) => {
  return (
<section id="introduction" className="format-section">
  <div className="intro-video" data-aos="fade-up">
    {props.intro?.link ? (
      <iframe
        width="560"
        height="315"
        src={props.intro.link}
        title="Introducción"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    ) : (
      <div className="intro-text">
        <p><strong>Español:</strong> Soy un ingeniero apasionado por la tecnología, siempre buscando soluciones eficientes y creativas.</p>
        <p><strong>English:</strong> I'm an engineer passionate about technology, always seeking efficient and creative solutions.</p>
      </div>
    )}
  </div>
</section>

  );
};

export default Introduction;
