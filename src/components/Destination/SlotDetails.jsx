import  { useRef, useState, useContext } from 'react'
import Modal from '../UI/Modal'
import classes from './SlotDetails.module.css'
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import swal from 'sweetalert';
import AuthCredentials from '../../store/AuthCredentials';



const isEmpty= value=> value.trim()==='';
const isTenChars = (value) => value.trim().length === 10;
let email;
let caltime;
var calctime=[];
let currentBookingTime;

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var d = new Date();
var day = days[d.getDay()];
var hr = d.getHours();
var min = d.getMinutes();
if (min < 10) {
    min = "0" + min;
}
var ampm = "am";
if( hr > 12 ) {
    hr -= 12;
    ampm = "pm";
}
var date = d.getDate();
var month = months[d.getMonth()];
var year = d.getFullYear();
currentBookingTime = day + " " + hr + ":" + min + ampm + " " + date + " " + month + " " + year;



const SlotDetails = (props) => {
  const authCre = useContext(AuthCredentials);
  const linkurl= authCre.db_url;
  const AuthKey= authCre.AuthKey;
  var advdate=0
  advdate=props.date
  var toTime = props.to;
  var fromTime= props.from;
  var amount=props.amount;
  
  var bookedtime=props.bookedtime;
  if(toTime == 0 && (advdate ==undefined|| advdate==""))
  
    {
    console.log(advdate)
    console.log(toTime)
    swal( "Please select the slots","", "warning");
    props.onClose()
  }
  
  const params=useParams();
  const history= useHistory();
    const[displayDate, setDisplayDate]= useState(true)
    const [formInputsValidity, setFormInputsValidity] = useState({
      name: true,
      vehicle: true,
      phone: true,
      regno: true,
    });
    
   

    const nameInputRef = useRef();
    const vehicleInputRef = useRef();
    const regnoInputRef = useRef();
    const phoneInputRef = useRef();
   
    var calctimefinalstr;
    console.log(bookedtime);
    console.log(amount)
    console.log(advdate)
    

  
    const confirmHandler = (event) => {
      // event.preventDefault();
  
      const enteredName = nameInputRef.current.value;
      const enteredVehicle = vehicleInputRef.current.value;
      const enteredRegno = regnoInputRef.current.value;
      const enteredPhone = phoneInputRef.current.value;
  
      const enteredNameIsValid = !isEmpty(enteredName);
      const enteredVehicleIsValid = !isEmpty(enteredVehicle);
      const enteredPhoneIsValid = isTenChars(enteredPhone);
      const enteredRegnoIsValid = !isEmpty(enteredRegno);
  
      setFormInputsValidity({
        name: enteredNameIsValid,
        vehicle: enteredVehicleIsValid,
        phone: enteredPhoneIsValid,
        regno: enteredRegnoIsValid,
      });
  
      const formIsValid =
        enteredNameIsValid &&
        enteredVehicleIsValid &&
        enteredPhoneIsValid &&
        enteredRegnoIsValid;
      
     if (!formIsValid) {
      event.preventDefault();
        }
      else{
        let i=0;
        const requestOptions={
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            idToken: localStorage.getItem("token")
          })
        }
        fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key="+AuthKey, requestOptions)
        .then(response => response.json())
        .then((data)=>{
          console.log(data)
          let email1
          email1=data.users[0].email;
          email=email1.replace(/\./g, "-");
          console.log(email)
         i++;
          a()
        })
       function a(){
        caltime=fromTime;

        for(var i=0;i<bookedtime;i++){
          caltime++;
          calctime.push(caltime);
            }
            calctimefinalstr=calctime.toString();
            const calctimefinal = calctimefinalstr.split(",");
            for(var j=0;j<bookedtime;j++){
              calctime.pop();
            }  
            
       if(i>=1){
       if(props.to==0 || props.from==0)
       {
        const url1=linkurl
      fetch(url1 +"/booking-history/"+ email+ ".json", {
               method: 'POST',
               body: JSON.stringify({
                name:enteredName,
                    phone:enteredPhone,
                    currentBooking:currentBookingTime,
                    registration:enteredRegno,
                    vehicle:enteredVehicle,
                    BookedDate:advdate,
                    EntryTime:1,
                    ExitTime:23,
                    TotalAmount:amount,
                    advbook:true,
                    key:amount
               })
             });
             const d = new Date();
             const url=linkurl
           fetch(url + "/slots/" + advdate  +"/"+ email+ ".json", {
                    method: 'POST',
                    body: JSON.stringify({
                     date:d,
                  
                    })
                  });
       }
       else{
        const url1=linkurl
      fetch(url1 +"/booking-history/"+ email+ ".json", {
               method: 'POST',
               body: JSON.stringify({
                name:enteredName,
                    phone:enteredPhone,
                    currentBooking:currentBookingTime,
                    registration:enteredRegno,
                    vehicle:enteredVehicle,
                    BookedDate:props.todayDate,
                    EntryTime:props.from,
                    ExitTime:props.to,
                    TotalAmount:amount,
                    advbook:false
               })
             });
             for(var k=0;k<calctimefinal.length;k++){
              var z=calctimefinal[k];
            var z1=z-1
              const d = new Date();
              const url=linkurl;
            fetch(url + "/slots/" + props.todayDate +"/"+z1+"-" +z +"/"+ email+ ".json", {
                     method: 'POST',
                     body: JSON.stringify({
                      date:d,
                   
                     })
                   });
            }
            }
       }}
         
       history.push(`/details/${params.detailId}/payment`);

        
      }
       
    };
  
    const nameControlClasses = `${classes.control} ${
      formInputsValidity.name ? '' : classes.invalid
    }`;
    const vehicleControlClasses = `${classes.control} ${
      formInputsValidity.vehicle ? '' : classes.invalid
    }`;
    const regnoControlClasses = `${classes.control} ${
      formInputsValidity.regno ? '' : classes.invalid
    }`;
    const phoneControlClasses = `${classes.control} ${
      formInputsValidity.phone ? '' : classes.invalid
    }`;
  
    
  
    return (
      <Modal onClose={props.onClose}>
        <h2 style={{textAlign:"center"}}>User Details Form</h2>
      
        <form  className={classes.form} onSubmit={confirmHandler}>
        <div >
        <div className={nameControlClasses}>
          <label htmlFor='name'>Rider Name</label>
          <input type='text' id='name' ref={nameInputRef} />
          {!formInputsValidity.name && <span style={{color:"red"}}>  *Enter a valid name!</span>}
        </div>
        
         <div className={vehicleControlClasses}>
          <label htmlFor='Vehicle'>Vechicle Type</label>
          <select name="vechicle" id="Vehicle"  ref={vehicleInputRef}>
          {/* <option value="Two-Wheeler">Two-Wheeler</option> */}
          <option value="Four-Wheeler">Four-Wheeler</option>
          </select>
          {!formInputsValidity.vehicle && <span >Enter a valid Vehicle!</span>}
        </div>


        <div className={regnoControlClasses}>
          <label htmlFor='Registration'>Vehicle Reg. No</label>
          <input type='tel' id='Registration' ref={regnoInputRef} />
          {!formInputsValidity.regno && (
            <span style={{color:"red"}}>   *Enter a valid Registration Number !</span>
          )}
        </div>
        <div className={phoneControlClasses}>
          <label htmlFor='phone'>Mobile Number</label>
          <input type='tel' id='phone' ref={phoneInputRef} placeholder="99999-99999" />
          {!formInputsValidity.phone && <span style={{color:"red"}}>   *Enter a valid Mobile No.(10 chars long) !</span>}
        </div>
      
      </div>
      <div>
     

        <div className={classes.actions}>
          <button type='button' onClick={props.onClose}>
            Cancel
          </button>
          <button className={classes.submit}>Confirm</button>
        </div>
        </div>
      </form>
      </Modal>
    );
  };
  
  export default SlotDetails;
  