import { Switch, Route, Redirect } from "react-router-dom";
import { useContext } from "react";
import Layout from "./components/Layout/Layout";
import ProfileForm from "./components/Profile/ProfileForm";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import AuthContext from "./store/AuthContext";
import HomeLogin from "./pages/HomeLogin";
import DestinationDetails from "./components/Destination/DestinationDetails";
import Payment from "./pages/Payment";
import Details from "./pages/Details";

function App() {
  const authCtx = useContext(AuthContext);
  const getData = (val) => {};

  return (
    <>
      <Layout>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
          {!authCtx.isLoggedIn && (
            <Route path="/auth">
              <AuthPage sendData={getData} />
            </Route>
          )}

          {!authCtx.isLoggedIn && (
            <Route path="/profile">
              <ProfileForm />
            </Route>
          )}

          {authCtx.isLoggedIn && (
            <Route path="/home">
              <HomeLogin />
            </Route>
          )}

          {authCtx.isLoggedIn && (
            <Route path="/user-details">
              <Details />
            </Route>
          )}

          {authCtx.isLoggedIn && (
            <Route path="/details/:detailId" exact>
              <DestinationDetails />
            </Route>
          )}

          {authCtx.isLoggedIn && (
            <Route path="/details/:detailId/payment" exact>
              <Payment />
            </Route>
          )}

          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Layout>
    </>
  );
}

export default App;
