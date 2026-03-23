import { useEffect, useRef } from "react";
import { Toast } from "bootstrap";

const MessageModal = ({ show, message, type, onClose }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    if (show) {
      const toastInstance = new Toast(toastRef.current, {
        delay: 3000,
      });
      toastInstance.show();

      toastRef.current.addEventListener("hidden.bs.toast", onClose);
    }
  }, [show]);

  const getBgClass = () => {
    switch (type) {
      case "create":
        return "bg-success";
      case "update":
        return "bg-primary";
      case "delete":
        return "bg-danger";
      case "none":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      <div
        ref={toastRef}
        className={`toast text-white ${getBgClass()}`}
        role="alert"
      >
        <div className="toast-body d-flex justify-content-between align-items-center">
          {message}
          <button
            type="button"
            className="btn-close btn-close-white ms-2"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;

// const [toast, setToast] = useState({
//   show: false,
//   message: "",
//   type: "",
// });

// const showToast = (type, message) => {
//   setToast({ show: true, type, message });
// };

//     <button
//       className="btn btn-primary me-2"
//       onClick={() => showToast("update", "Updated successfully")}
//     >
//       Update
//     </button>

// <MessageToast
//       show={toast.show}
//       message={toast.message}
//       type={toast.type}
//       onClose={() =>
//         setToast({ show: false, message: "", type: "" })
//       }
//     />
