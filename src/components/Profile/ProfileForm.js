import classes from "./ProfileForm.module.css";
import { useRef, useContext } from "react";
import AuthCredentials from "../../store/AuthCredentials";
import swal from "sweetalert";
const ProfileForm = () => {
  const newEmail = useRef();
  const authCre = useContext(AuthCredentials);
  const AuthKey= authCre.AuthKey;
  const submitHandler = (event) => {
    event.preventDefault();
    const enterEmail = newEmail.current.value;
    console.log(enterEmail);
    //user validation
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key="+AuthKey,
      {
        method: "POST",
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email: enterEmail,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        //asumption:always succed
        if (!res.ok) {
          throw Error(res.statusText);
        }

        swal(
          "Email Sent!",
          "Password Reset Verification link sent to your Email!",
          "success"
        );
        return res.json();
      })
      .catch((err) => {
        console.log("Error");
        swal(" Invalid Email!", "Please enter a valid Email", "error");
      });
  };
  return (
    <>
      <section className={classes.profile}>
        <h1>Reset Password Page</h1>
      </section>
      <form onSubmit={submitHandler} className={classes.form}>
        <div className={classes.control}>
          <label htmlFor="new-email">Enter Email</label>
          <input type="email" id="new-email" ref={newEmail} required />
        </div>
        <div className={classes.action}>
          <button>Submit</button>
        </div>
      </form>
    </>
  );
};

export default ProfileForm;
