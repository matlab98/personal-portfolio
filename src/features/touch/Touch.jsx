import React, { useRef }  from "react";
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";

const Touch = ({ email }) => {
  const form = useRef();

  const {
    REACT_APP_EMAILJS_SERVICE_ID: serviceId,
    REACT_APP_EMAILJS_TEMPLATE_ID: templateId,
    REACT_APP_EMAILJS_USER_ID: userId,
  } = process.env;

  var working = false;

  function sendEmail(e) {
    e.preventDefault();

    if (working) return;
    working = true;
    var log = document.getElementById("contact-form");
    log.classList.add("loading");

    emailjs.sendForm(serviceId, templateId, form.current, userId).then(
      () => {
        log.classList.remove("loading");
        log.classList.add("ok");
      },
      (error) => {
        console.log("FAILED...", error.text);
        log.classList.remove("loading");
        log.classList.add("error");
      }
    );
  }
  return (
    <section id="contact" className="format-section">
      <div className="row">
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="heading">
            <strong className="sect-title">
              <span>Contáctame</span>
            </strong>
            <p>
              Si te interesa mi trabajo, escríbeme y hablamos de tu proyecto.
            </p>
          </div>
        </div>
      </div>

      <form id="contact-form" className="contact" ref={form} onSubmit={sendEmail}>
        <div className="contact-form">
          <input
            type="hidden"
            id="who"
            name="who"
            value={email[0] || email[1]}
            required
          />
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Tu nombre"
          />
          <i className="fa fa-user"></i>
          <input
            type="text"
            id="email"
            name="email"
            required
            placeholder="Correo"
          />
          <i className="fa fa-envelope"></i>
          <textarea
            type="text"
            id="message"
            name="message"
            required
            placeholder="Mensaje"
          />
          <i className="fa fa-comment"></i>
        </div>
        <button id="send-email">
          <i className="spinner"></i>
          <span className="state">Enviar</span>
        </button>
      </form>
    </section>
  );
};

export default Touch;
