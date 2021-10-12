import React from 'react'
import classes from './PaymentIndex.module.css'

function PaymentIndex(props) {
    return (
        <li className={classes.meal}>
        <div>
             <h3>{props.name}</h3>
        <div className={classes.description}>{props.phone}</div>
        <h4>Booking Date: {props.BookedDate}</h4>
        <h4>Vehicle Registration No:{props.registration}</h4>
        <h4>Vehicle Type:{props.vehicle}</h4>
        <h4>Total Amount:&#8377;{props.TotalAmount}</h4>
        </div>
        </li>
    )
}

export default PaymentIndex
