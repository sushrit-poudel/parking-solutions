import React from 'react';
import ReactDOM from 'react-dom';
import classes from './Modal.module.css'

const Backdrop=(props)=>{
    return<div className={classes.backdrop} onClick={props.onClose}>

    </div>
}
const ModelOverlay=(props)=>{
    return<div className={classes.modal}>
        <div className={classes.content}>{props.children} </div>
    </div>
}
const porrtalElements=document.getElementById("root");
function Modal(props) {
    return <>
            {ReactDOM.createPortal(<Backdrop onClose={props.onClose}/>,porrtalElements )}
            {ReactDOM.createPortal(<ModelOverlay>{props.children}</ModelOverlay>,porrtalElements)}
        </>
    
}
export default Modal;