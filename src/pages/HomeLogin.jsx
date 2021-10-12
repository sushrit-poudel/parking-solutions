import React from 'react'
import classes from './HomeLogin.module.css'
import Destination from '../components/Destination/Destination'

function HomeLogin(props) {
    console.log(props.name)

    return (
        <div>
        <section className={classes.starting}>
          <h1>Choose Your Destination</h1>
         </section>
         <Destination/>
            
        </div>
    )
}

export default HomeLogin
