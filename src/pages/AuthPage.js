import AuthForm from '../components/Auth/AuthForm';


const AuthPage = (props) => {
  
  const getData=(val)=>{
    console.log("p",val)
    let name=val;
    props.sendData(name)
    
    }
  
  return <AuthForm sendName={getData} />;
};

export default AuthPage;
