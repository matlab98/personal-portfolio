import emailjs from "emailjs-com";
import { emailKey } from "../../config/config";

const Touch = ({ email }) => {
  let working = false;
  function sendEmail(e) {
    e.preventDefault();

    if (working) return;
    working = true;
    let log = document.getElementById("contact-form");
    log.classList.add("loading");

    emailjs
      .sendForm(
        emailKey.serviceId,
        emailKey.templateId,
        e.target,
        emailKey.userId
      )
      .then(
        (result) => {
          if (result["status"] === 200) {
            log.classList.remove("loading");
            log.classList.add("ok");
          }
        },
        (error) => {
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
            <p>Aún no estás convencido, entonces escríbeme.</p>
          </div>
        </div>
      </div>

      <form id="contact-form" className="contact" onSubmit={sendEmail}>
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
        <button>
          <i className="spinner"></i>
          <span className="state">Enviar</span>
        </button>
      </form>
    </section>
  );
};

export default Touch;
