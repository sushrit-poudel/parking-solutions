import classes from './StartingPageContent.module.css';
import park from '../../images/park.jpg';
import Summary from './Summary';
import AuthContext from '../../store/AuthContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';


const StartingPageContent = () => {
  const authCtx= useContext(AuthContext);
  
  return (
    <>
    <div className={classes['main-image']} >
        <img src={park} alt="parking"/>
    </div>
    <Summary/>
    {authCtx.isLoggedIn&&
    <Link className={classes.Button} to={'/home'}>Book Now </Link>
     }
  
    <footer >
      <p className={classes.foot}> &copy;MyParkingApp, Some rights reserved. Made with React +🔥FireBase!</p>
    </footer>

    </>
    
  );
};

export default StartingPageContent;
