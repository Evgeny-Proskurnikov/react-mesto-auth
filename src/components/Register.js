import React from 'react';
import Form from './Form';

function Register({ title, btnName, submitRegisterForm, submitState, setSubmitState, children }) {
  return (
    <Form 
      title={title} 
      btnName={btnName} 
      submitForm={submitRegisterForm} 
      setFormSubmitState={setSubmitState}
      formSubmitState={submitState}
      children={children}
    />
  );
}

export default Register;
