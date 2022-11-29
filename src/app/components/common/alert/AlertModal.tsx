import { Modal } from "react-bootstrap";

const AlertModal = ({ showAlert, closeAlert, responseAlert }: any) => {
  console.log("Entro modal Alert");
  const handleresponse = (op:number) => {
    console.log('Respuesta: ', op);
    responseAlert(op)
  }
  return (
    <>
      <Modal show={showAlert} onHide={closeAlert}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <h5 className="fw-bolder fs-1 mb-5">¿Esta usted seguro?</h5>

            <div className="separator separator-dashed border-danger opacity-25 mb-5"></div>

            <div className="mb-9">
              ¿ Esta usted seguro que quiere eliminar los registros ?
            </div>
            <div className="d-flex flex-center flex-wrap">
              <a
                href="#"
                className="btn btn-outline btn-outline-danger btn-active-danger m-2"
                onClick={closeAlert}
              >
                Cancelar
              </a>
              <a
                href="#"
                className="btn btn-danger m-2"
                onClick={() => handleresponse(1)}
              >
                Eliminar
              </a>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer></Modal.Footer> */}
      </Modal>
    </>
  );
};

export default AlertModal;
