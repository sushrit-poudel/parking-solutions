import React from 'react';
import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/AuthContext';
import { useHistory } from 'react-router-dom';
import classes from './AuthForm.module.css';
import { Link } from 'react-router-dom';
import AuthCredentials from '../../store/AuthCredentials';


 const AuthForm = (props) => {
  const history= useHistory()
  const emailInputRef=useRef()
  const nameInputRef=useRef()
  const passwordInputRef= useRef()
  const authCtx=useContext(AuthContext)
  const authCre=useContext(AuthCredentials)
  const AuthKey= authCre.AuthKey;
  const [isLogin, setIsLogin] = useState(true);
  let name
 
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const submitHandler=(event)=>{
    event.preventDefault()
    const enteredEmail= emailInputRef.current.value;
    const enteredpassword= passwordInputRef.current.value;
    
    if(isLogin){
      
       fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="+AuthKey,
       {
        method:'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredpassword,
          returnedSecureToken:true
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      ).then(res=>{

        if(res.ok){
         
          return res.json()
        } else{
          return res.json().then((data)=>{
             let errorMessage='Authentication Failed';
            
            throw new Error(errorMessage)
          });
        }
      })
      .then((data)=>{
        console.log(data)
        authCtx.login(data.idToken);
        history.replace('/')
        const requestOptions={
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            idToken: data.idToken
          })
        }
          fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key="+AuthKey, requestOptions)
          .then(response => response.json())
          
          .then((data)=>{
            console.log(data)
            name=data.users[0].displayName;
            props.sendName(name)
            console.log("c",name)
          })
      })

      .catch((err)=>{
        alert(err.message)
      })
}
    
    else{
      const enteredName=nameInputRef.current.value;
       fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="+AuthKey,
        
      {
        method:'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredpassword,
          returnedSecureToken:true
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      ).then(res=>{

        if(res.ok){
          
          return res.json()
        } else{
          return res.json().then((data)=>{
             let errorMessage='Authentication Failed';
            
            throw new Error(errorMessage)
          });
        }
      })
      .then((data)=>{
        console.log(data)
        authCtx.login(data.idToken);
        
        history.replace('/')
        //sending name
        const requestOptions={
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            idToken: data.idToken,
            displayName: enteredName,
            returnedSecureToken:true
          })
        }
          fetch("https://identitytoolkit.googleapis.com/v1/accounts:update?key="+AuthKey, requestOptions)
          .then(response => response.json())
          .then((data)=>{
            console.log(data)
          })
            //sending name end here
       })

      .catch((err)=>{
        alert(err.message)
      })
}
  }
  
 

  return (<>
  
  
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
       {isLogin && <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div> }
       {isLogin && <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>}
       {!isLogin&& <div className={classes.control}> 
        <label htmlFor='name'>Name</label>
          <input type='text' id='name' required ref={nameInputRef} />
        </div>}
        {!isLogin && <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div> }
        {!isLogin && <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>}
       
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          {!authCtx.isLoggedIn&&
          <Link className={classes.link} to={'/profile'}>Forgot Password </Link>
          }
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  
    
    </>
  );
};

export default AuthForm;
