import classes from './DestinationIndex.module.css';
import DestinationForm from './DestinationForm';

const DestinationIndex = (props) => {
  const price = `${props.price.toFixed(2)}`;
  return (
    <li className={classes.destination}>
      <div>
        <h3>{props.name}</h3>
        <div className={classes.description}>{props.description}</div>
        <div className={classes.price}>&#8377;{price} per Hour</div>
      </div>
      <div>
      <DestinationForm id={props.id} />
       
      </div>
    </li>
  );
};

export default DestinationIndex;