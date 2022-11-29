import React from 'react'
import { Form, Modal, Row } from 'react-bootstrap'
import './stylesDialog.scss';

interface DialogAcceptProps {
  title: string;
  message: string;
  textAcceptButton: string;
  isVisible: boolean;
  onAccept(): void;
}

const DialogAccept = (props: DialogAcceptProps) => {

  return (
    <>
      <Modal 
        className="my-modal"
        show={props.isVisible} 
        onHide={props.onAccept}
        backdrop='static' 
      >
        
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row>
              <p>{props.message}</p>
            </Row>
            <Row className='justify-content-around'>
              <div className='row m-0'>
                <div className='col-12'>
                  <div className='row m-0'>
                    <button type='button' onClick={props.onAccept} className="btn btn-primary">{props.textAcceptButton}</button>
                  </div>
                </div>
              </div>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default DialogAccept;
