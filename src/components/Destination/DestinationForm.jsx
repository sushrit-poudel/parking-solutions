
import classes from './DestinationForm.module.css';
import { Link } from 'react-router-dom';

const DestinationForm = (props) => {
  return (
    <form className={classes.form}>
     
      <Link to={`/details/${props.id}`} className={classes.btn}>Park Here
      
       </Link>
    </form>
  );
};

export default DestinationForm;