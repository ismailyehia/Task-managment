import React from "react";

const Modal = ({children , isOpen , onClose , title}) => {

    if (!isOpen) return null;

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
      {/* Modal header */}
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1l6 6m0 0l6 6M7 7L1 13M7 7l6-6"
            />
          </svg>
        </button>
      </div>

      <div className="mt-4">
        {/* Your modal body or content */}

        {children}

      </div>
    </div>
  </div>
);

};
export default Modal;