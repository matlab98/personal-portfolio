import React from "react";
import ReactDom from "react-dom";
import { CgCloseR } from "react-icons/cg";

const CardModal = (props) => {
  if (props.open === false) return null;
  return ReactDom.createPortal(
    <>
      <div className="overlay-style">
        <div className="div-close-overlay" onClick={props.close}>
          <CgCloseR id="close-popup-icon" />
        </div>
        <div className="modal-style">
          <img
            src=""
            alt=""
            className={props.fitHeight ? "fit-height" : "popup-images"}
          />
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
};
export default CardModal;
