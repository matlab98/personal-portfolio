import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";
import "./assets/style/style.css";
import { emailKey } from "./../../config/config";

const Touch = ({ email }) => {
  const { t } = useTranslation();
  const form = useRef();
  const [status, setStatus] = useState(""); // '', 'loading', 'ok', 'error'

  const sendEmail = (e) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    console.log(emailKey);
    emailjs
      .sendForm(
        emailKey.serviceId,
        emailKey.templateId,
        form.current,
        emailKey.userId
      )
      .then(
        () => setStatus("ok"),
        (error) => {
          console.log(error);
          console.error("FAILED...", error.text);
          setStatus("error");
        }
      );
  };

  return (
    <section id="contact" className="contact-section">
      <div className="heading">
        <h2>{t("contact.title")}</h2>
        <p>{t("contact.subtitle")}</p>
      </div>

      <form
        ref={form}
        onSubmit={sendEmail}
        className={`contact-form ${status}`}
      >
        <input type="hidden" name="who" value={email[0] || email[1]} required />

        <input
          type="text"
          name="name"
          placeholder={t("contact.name")}
          required
        />
        <input
          type="email"
          name="email"
          placeholder={t("contact.email")}
          required
        />
        <textarea name="message" placeholder={t("contact.message")} required />

        <button type="submit">
          {status === "loading" ? (
            <span className="spinner" />
          ) : (
            <span>{t("contact.submit")}</span>
          )}
        </button>

        {status === "ok" && (
          <p className="success-msg">{t("contact.success")}</p>
        )}
        {status === "error" && (
          <p className="error-msg">{t("contact.error")}</p>
        )}
      </form>
    </section>
  );
};

export default Touch;
