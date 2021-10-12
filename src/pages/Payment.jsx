import gif from "../images/gif.gif";
import React from "react";
import { useEffect, useState, useContext} from "react";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Card from "../components/UI/Card";
import classes from "./Payment.module.css";
import Pdf from "react-to-pdf";
import QRCode from "react-qr-code";
import AuthCredentials from "../store/AuthCredentials";
const ref = React.createRef();
const options = {
  orientation: "portrait",
  unit: "in",
  format: [12, 10],
};

let email,
  name1,
  phone1,
  BookedDate1,
  TotalAmount1,
  registration1,
  vehicle1,
  id1,
  ToTime1,
  FromTime1,
  BookingDate1;
const Payment = (props) => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();
  const authCre = useContext(AuthCredentials);
  const db_url= authCre.db_url;
  const AuthKey= authCre.AuthKey
  useEffect(() => {
    setIsLoading(true);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken: localStorage.getItem("token"),
      }),
    };
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key="+ AuthKey,
      requestOptions
    )
      .then((response) => response.json())
      // .then(data =>console.log(data));
      .then((data) => {
        console.log(data);
        let email1;
        email1 = data.users[0].email;
        email = email1.replace(/\./g, "-");
        console.log(email);

        const fetchDestinations = async () => {
          const url =
          db_url+"/booking-history";
          const response = await fetch(url + "/" + email + ".json");

          if (!response.ok) {
            throw new Error("Something went wrong!");
          }
          const responseData = await response.json();

          const loadedBill = [];

          for (const key in responseData) {
            loadedBill.push({
              id: key,
              name: responseData[key].name,
              phone: responseData[key].phone,
              BookingDate: responseData[key].currentBooking,
              BookedDate: responseData[key].BookedDate,
              FromTime: responseData[key].EntryTime,
              ToTime: responseData[key].ExitTime,
              TotalAmount: responseData[key].TotalAmount,
              registration: responseData[key].registration,
              vehicle: responseData[key].vehicle,
            });
          }
          id1 = loadedBill[loadedBill.length - 1].id;
          name1 = loadedBill[loadedBill.length - 1].name;
          phone1 = loadedBill[loadedBill.length - 1].phone;
          BookingDate1 = loadedBill[loadedBill.length - 1].BookingDate;
          BookedDate1 = loadedBill[loadedBill.length - 1].BookedDate;
          FromTime1 = loadedBill[loadedBill.length - 1].FromTime;
          ToTime1 = loadedBill[loadedBill.length - 1].ToTime;
          TotalAmount1 = loadedBill[loadedBill.length - 1].TotalAmount;
          registration1 = loadedBill[loadedBill.length - 1].registration;
          vehicle1 = loadedBill[loadedBill.length - 1].vehicle;

          setDestinations(loadedBill);
          setIsLoading(false);
        };

        fetchDestinations().catch((error) => {
          setIsLoading(false);
          setHttpError(error.message);
        });
      });

    // till here
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
        <p>{httpError}</p>
      </section>
    );
  }

  return (
    <div>
      <h1 className={classes.success}>Hurray! Booking Successfull</h1>
      <section className={classes.destinations}>
        <img className={classes.logo} src={gif} alt="loading..." />
        <h3 className={classes.success}>We wish to meet you soon... </h3>
        <Card>
          <div ref={ref}>
            <Card>
              <h2 className={classes.mid}>Booking Receipt</h2>
            </Card>
            <br />
            <h4>Booking Id: {id1}</h4>
            <h4>Rider Name: {name1}</h4>
            <h4>Mobile No.: {phone1}</h4>
            <h4>Booked On: {BookingDate1}</h4>
            <h4>Booking For: {BookedDate1}</h4>
            <h4>
              Booked Slot: {FromTime1}:00 - {ToTime1}:00 (Time Displayed in 24
              hours Format)
            </h4>
            <h4>Registration No: {registration1}</h4>
            <h4>Vehicle Type: {vehicle1}</h4>
            <h4>Total Amount: &#8377;{TotalAmount1}</h4>
            <div className={classes.centered}>
              <QRCode value={id1} />
            </div>
          </div>
        </Card>
        <Pdf
          targetRef={ref}
          filename="Parking Receipt.pdf"
          options={options}
          x={0.5}
          y={0.5}
          scale={1}
        >
          {({ toPdf }) => (
            <button className={classes.print} onClick={toPdf}>
              Download Booking Receipt
            </button>
          )}
        </Pdf>
      </section>
    </div>
  );
};
export default Payment;
