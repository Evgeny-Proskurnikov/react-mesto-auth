import React from 'react';
import Form from './Form';

function Login({ title, btnName, submitLoginForm, submitState, setSubmitState }) {
  return (
    <Form 
      title={title} 
      btnName={btnName} 
      submitForm={submitLoginForm} 
      setFormSubmitState={setSubmitState}
      formSubmitState={submitState}
    />
  );
}

export default Login;
