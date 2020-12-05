import React from 'react';
import Form from './Form';

function Register({ title, btnName, linkName, submitRegisterForm, submitState, setSubmitState }) {
  return (
    <Form 
      title={title} 
      btnName={btnName} 
      linkName={linkName} 
      submitForm={submitRegisterForm} 
      setFormSubmitState={setSubmitState}
      formSubmitState={submitState}
    />
  );
}

export default Register;
