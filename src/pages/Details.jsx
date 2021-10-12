import React from "react";
import { useEffect, useState, useContext } from "react";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import DetailsIndex from "./DetailsIndex";
import Card from "../components/UI/Card";
import classes from "./Details.module.css";
import AuthCredentials from "../store/AuthCredentials";
let email, name1, email1, registration, BookedDate, TotalAmount, vehicle, id;
function Details() {
  const authCre = useContext(AuthCredentials);
  const db_url= authCre.db_url;
  const AuthKey= authCre.AuthKey;
  const [destinations, setDestinations] = useState(["0"]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();

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

      .then((data) => {
        console.log(data);
        let email1;
        email1 = data.users[0].email;
        name1 = data.users[0].displayName;
        email = email1.replace(/\./g, "-");
        console.log(email);

        const fetchDestinations = async () => {
          const url = db_url+"/booking-history";
          const response = await fetch(
            url + "/" + email + ".json" + '?orderBy="$key"'
          );

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
              BookedDate: responseData[key].BookedDate,
              TotalAmount: responseData[key].TotalAmount,
              registration: responseData[key].registration,
              vehicle: responseData[key].vehicle,
            });
          }

          setDestinations(loadedBill);
          setIsLoading(false);
        };

        fetchDestinations().catch((error) => {
          setIsLoading(false);
          setHttpError(error.message);
        });
      });
    console.log(id);
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
  const destinationsList = destinations.map((destination) => (
    <DetailsIndex
      email={email}
      id={destination.id}
      name={destination.name}
      phone={destination.phone}
      BookedDate={destination.BookedDate}
      registration={destination.registration}
      vehicle={destination.vehicle}
      TotalAmount={destination.TotalAmount}
    />
  ));

  return (
    <div>
      <section className={classes.destinations}>
        <div className={classes.row}>
          <div className={classes.column}>
            <Card>
              <h2>User Details</h2>
              <h4>User Name: {name1}</h4>
              <h4>Email: {email}</h4>
            </Card>
          </div>
          <br />
          <div className={classes.column}>
            <Card>
              <h2>Booking History</h2>
              <hr />
              <ul>{destinationsList}</ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Details;
