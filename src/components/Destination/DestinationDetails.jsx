import classes from "./DestinationDetails.module.css";
import { useEffect, useRef, useState , useContext} from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../UI/LoadingSpinner";
import SlotDetails from "./SlotDetails";
import loading from "../../images/loading.webp";
import AuthCredentials from "../../store/AuthCredentials";

var des,
  name,
  price,
  bookedtime = 0,
  fromTime = 0,
  toTime = 0,
  amount = 0,
  idate;
let date = "0",
  maxdate,
  tempToTime = 0,
  tempFromTime = 0;
const DestinationDetails = (props) => {
  const authCre = useContext(AuthCredentials);
  const url= authCre.db_url;
  const params = useParams();
  let id = params.detailId;
  let mapdata;
  const FIREBASE_DOMAIN =
  url;

  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();
  const [modalIsShown, setModalIsShown] = useState(false);
  const [bookToday, setBookToday] = useState(true);
  const [bookAdvance, setBookAdvance] = useState(false);
  // const [billamount, setAmountHandler] = useState(false);

  const [addrtype, setAddrtype] = useState();
  function handleAddrTypeChange(event) {
    setAddrtype(event.target.value);
    console.log(event.target.value);
    tempToTime = event.target.value;
  }
  const [exit, setExit] = useState();
  function handleExitTypeChange(event) {
    setExit(event.target.value);
    console.log(event.target.value);
  }
  if (id == "om") {
    mapdata =
      "https://maps.google.com/maps?q=13.0110723,77.5528044&t=&z=15&ie=UTF8&iwloc=&output=embed";
  }
  if (id == "br") {
    mapdata =
      "https://maps.google.com/maps?q=12.9821895,77.6061598&t=&z=15&ie=UTF8&iwloc=&output=embed";
  }
  if (id == "cs") {
    mapdata =
      "https://maps.google.com/maps?q=12.9709909,77.6047109&t=&z=15&ie=UTF8&iwloc=&output=embed";
  }

  var [bookTime, setBookTime] = useState();
  const [calcamout, setcalcamount] = useState();

  const toInputRef = useRef();
  const fromInputRef = useRef();
  const dateInputRef = useRef();

  console.log("a", toTime);
  console.log(fromTime);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm1 = String(today.getMonth()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  var formatedDate = 0;

  let d = new Date(yyyy, mm1, dd);
  let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
  let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
  formatedDate = `${da}-${mo}-${ye}`;

  var maxdate = new Date();
  maxdate.setDate(maxdate.getDate() + 15);
  var aa = String(maxdate.getDate()).padStart(2, "0");
  var bb = String(maxdate.getMonth() + 1).padStart(2, "0"); //January is 0!
  var cccc = maxdate.getFullYear();

  maxdate = cccc + "-" + bb + "-" + aa;

  var todayplusone = new Date();
  todayplusone.setDate(todayplusone.getDate() + 1);
  var qq = String(todayplusone.getDate()).padStart(2, "0");
  var ww = String(todayplusone.getMonth() + 1).padStart(2, "0"); //January is 0!
  var eeee = todayplusone.getFullYear();
  todayplusone = eeee + "-" + ww + "-" + qq;

  var maxAdvanceDate = new Date();
  maxAdvanceDate.setDate(maxAdvanceDate.getDate() + 15);
  var rr = String(maxAdvanceDate.getDate()).padStart(2, "0");
  var tt = String(maxAdvanceDate.getMonth() + 1).padStart(2, "0"); //January is 0!
  var uuuu = maxAdvanceDate.getFullYear();
  maxAdvanceDate = uuuu + "-" + tt + "-" + rr;


  const showModalHandler = () => {
    setModalIsShown(true);
  };
  const HideModalHandler = () => {
    setModalIsShown(false);
  };
  const TodaysBookingHandler = () => {
    setBookAdvance(false);
    setBookToday(true);
    date = "0";
    toTime = 0;
    fromTime = 0;
  };
  const AdvanceBookingHandler = () => {
    setBookToday(false);
    setBookAdvance(true);
    toTime = 0;
    fromTime = 0;
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchDestinations = async () => {
      const response = await fetch(
        `${FIREBASE_DOMAIN}/destinations/${params.detailId}.json`
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const responseData = await response.json();

      des = responseData.description;
      name = responseData.name;
      price = responseData.price;

      setIsLoading(false);
    };

    fetchDestinations().catch((error) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  if (isLoading) {
    return (
      <section className={classes.centered}>
        <LoadingSpinner />
      </section>
    );
  }
  if (httpError) {
    return (
      <section>
        <h1 className={classes.failed}>
          Please Check Your Internet Connection!
        </h1>
        <img className={classes.faillogo} src={loading} alt="" />
      </section>
    );
  }

  const SubmitHandler = (event) => {
    if (event !== undefined) {
      event.preventDefault();
    }

    if (fromInputRef.current != undefined) {
      toTime = fromInputRef.current.value;
      fromTime = toInputRef.current.value;

      bookedtime = 0;
      amount = 0;
      bookedtime = toTime - fromTime;
      if (bookedtime < 0) {
        bookedtime = 0;
      }
      if (fromTime >= 17 && toTime <= 19) {
        setBookTime((bookTime) => bookedtime);
        amount = price * bookedtime * 1.2 + " (Dynamic Fair Charge: 20% )";
        setcalcamount((calcamout) => amount);
      } else {
        setBookTime((bookTime) => bookedtime);
        amount = price * bookedtime;
        setcalcamount((calcamout) => amount);
      }
    }

    if (dateInputRef.current != undefined) {
      idate = dateInputRef.current.value;
      date = idate.toString();
      bookedtime = 0;
      amount = 0;
      bookedtime = 17;
      setBookTime((bookTime) => bookedtime);
      amount = price * bookedtime * 0.8 + "  (20% Discount)";
    }
  };
  var cur = new Date();
  var current = cur.getHours() + 1;
  function createSelectItems() {
    let items = [];
    if (tempToTime == 0) {
      items.push(
        <option key={0} value={0}>
          Select Entry Time
        </option>
      );
    }

    if (current >= 23) {
      items.push(
        <option key={0} value={0}>
          No Slots available
        </option>
      );
    }

    for (let i = current; i < 23; i++) {
      items.push(
        <option key={i} value={i}>
          {i}:00
        </option>
      );
    }
    return items;
  }

  function createToSelectItems() {
    let toitems = [];
    if (current >= 23) {
      toitems.push(
        <option key={0} value={0}>
          No Slots available
        </option>
      );
    }
    if (tempToTime == 0) {
      toitems.push(
        <option key={0} value={0}>
          Select Exit Time
        </option>
      );
    } else {
      var toTimeInt = parseInt(tempToTime);
      for (let j = toTimeInt + 1; j < 24; j++) {
        toitems.push(
          <option key={j} value={j}>
            {j}:00
          </option>
        );
      }
    }
    return toitems;
  }

  function toTimeSelect(event) {
    if (tempToTime == 0) {
      alert("Select Entry Time");
    }
  }

  return (
    <>
     <div className={classes.wrapper}>
      <figure className={classes.destination}>
        <p>{name}</p>
        <figcaption>{des}</figcaption>
        <hr />
        <br />
        <h3>
          <strong> Amenities</strong>
        </h3>

        <li>24x7 CCTV Survillance</li>
        <br />
        <li>EV Charging</li>
        <br />
        <li>Roof Covered</li>
        <br />
        <li>Car washing areas</li>
        <br />
        <li>Tyre inflation stations</li>
        <br />
        <li>Mechanic On Call</li>
      </figure>

      {modalIsShown && (
        <SlotDetails
          onClose={HideModalHandler}
          to={toTime}
          from={fromTime}
          date={idate}
          amount={amount}
          bookedtime={bookedtime}
          todayDate={today}
        />
      )}
     
      <form onSubmit={SubmitHandler}>
        <div className={classes.slots}>
          <br />
          <div className={classes.box1}>
            <div className={classes.btnHeader}>
              <button
                onClick={TodaysBookingHandler}
                className={classes.nowbutton}
                autoFocus
              >
                Book For Today
              </button>
              <button
                onClick={AdvanceBookingHandler}
                className={classes.advbutton}
              >
                Book in Advance
              </button>
            </div>
            {bookToday && (
              <div>
                <h3 style={{ textAlign: "center" }}>
                  Booking for {formatedDate}
                </h3>
                <h5 style={{ textAlign: "center", color: "red" }}>
                  *Booking options available till 11:00pm Today{" "}
                </h5>
                <div className={classes.formInput}>
                  <label className={classes.totime} htmlFor="time">
                    <strong>From:</strong>
                  </label>
                  <select
                    name="time"
                    onChange={handleAddrTypeChange}
                    id="time"
                    ref={toInputRef}
                  >
                    {createSelectItems()}
                  </select>
                  <br />
                  <label htmlFor="time">
                    <strong>To:</strong>
                  </label>
                  <select
                    name="time"
                    onChange={toTimeSelect}
                    id="time"
                    ref={fromInputRef}
                  >
                    {createToSelectItems()}
                  </select>
                </div>
                <button className={classes.submit} type="submit">
                  Confirm Slot
                </button>
              </div>
            )}

            {bookAdvance && (
              <div>
                <h3 style={{ textAlign: "center" }}> Advanced booking form</h3>
                <h5 style={{ textAlign: "center", color: "red" }}>
                  *Advance Booking options available from 1:00am-11:00pm of the
                  selected Date{" "}
                </h5>
                <div>
                  <input
                    className={classes.advForm}
                    type="date"
                    name="date"
                    id="date"
                    min={todayplusone}
                    max={maxAdvanceDate}
                    ref={dateInputRef}
                  />
                </div>
                <button className={classes.submitadv} type="submit">
                  Confirm Date
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
      <div className={classes.map}>
        <iframe
          frame
          width="777"
          height="355"
          id="gmap_canvas"
          src={mapdata}
        ></iframe>
      </div>
      <div className={classes.amount}>
        <h2 className={classes.title}>Total Amount</h2>
        <div className={classes.bookform}>
          <span className={classes.booked}>Booking Time </span>
          <span className={classes.time}>{bookedtime} hours</span>
          <br />
          <br />
          <span>Rate per hour </span>
          <span className={classes.price}>&#8377;{price}</span>
          <br />
          <br />
          <div>
            <span>Calculations</span>
            <span className={classes.final}>
              {price} * {bookedtime}
            </span>
          </div>
          <hr />
          <span>Billing Amount</span>
          <span className={classes.amt}> &#8377;{amount}</span>
        </div>
      </div>
      </div>

      <footer className={classes.foot}>
        <li onClick={showModalHandler} className={classes.but}>
          Proceed to Book{" "}
        </li>
      </footer>
    </>
  );
};

export default DestinationDetails;
