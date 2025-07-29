// Modal.js
import React from "react";
import "./Modal.scss"; // Create a corresponding SCSS file for styling
import { X } from "react-feather";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <X className="icon" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
