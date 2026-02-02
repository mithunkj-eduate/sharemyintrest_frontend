import Offcanvas from "react-bootstrap/Offcanvas";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

function RightDrawer({ show, setShow }) {
  const handleClose = () => setShow(false);
  const navigate = useNavigate();

  return (
    <>
      <Offcanvas
        show={show}
        onHide={handleClose}
        name={"end"}
        placement={"end"}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Settings</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div
            className={`navItem d-flex gap-3 fs-5 justify-content-end`}
            onClick={() => {
              localStorage.clear();
              setTimeout(() => {
                navigate("/login");
              }, 500);
            }}
          >
            Log Out
            <LuLogOut
              className="fs-1 textPrimary"
              style={{ cursor: "pointer" }}
            />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default RightDrawer;
