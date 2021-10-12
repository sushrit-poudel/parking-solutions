import React, { useState } from 'react'
import classes from './DetailsIndex.module.css'
let useremail, email1;
function DetailsIndex(props) {
    
     useremail=props.email
     email1=useremail.replace(/\-/g, ".");
    console.log(email1)
    return (
    
        <li className={classes.destination}>
        <div>
            <h4>BookingId:  {props.id}</h4>
        <h4>Name:  {props.name}</h4>
        <h4>User Email: {email1}</h4>
        <h4 className={classes.description}>Mobile No:  {props.phone}</h4>
        <h4>Booking Date:{props.BookedDate}</h4>
        <h4>Vehicle Registration Number:  {props.registration}</h4>
        <h4>Total Amount:  {props.TotalAmount}</h4>
        <h4></h4>
        <hr />
        </div>
        </li>
        
    )
}

export default DetailsIndex
