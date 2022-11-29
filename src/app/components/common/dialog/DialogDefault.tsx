import { useState } from 'react'
import { Form, Modal, Row } from 'react-bootstrap'
import './stylesDialog.scss';
interface DialogDefaultProps {
  title: string;
  message: string;
  textAcceptButton: string;
  textCancelButton: string;
  isVisible: boolean;
  type: "default" | "success" | "warning" | "info" | "danger"; 
  onAccept(): void;
  onCancel(): void;
}

const DialogDefault = (props: DialogDefaultProps) => {

  return (
    <>
      <Modal 
        className="my-modal"
        show={props.isVisible}
        onHide={props.onCancel}
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
                <div className='col-6'>
                  <div className='row m-0'>
                    <button 
                      type='button' 
                      onClick={props.onAccept} 
                      className={`btn btn-${props.type === 'default' ? 'primary' : props.type}`}
                    >
                      {props.textAcceptButton}
                    </button>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='row m-0'>
                    <button type='button' onClick={props.onCancel} className="btn btn-secondary">{props.textCancelButton}</button>
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

export default DialogDefault;
