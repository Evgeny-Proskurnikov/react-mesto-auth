import React from 'react';

function Header({ link, linkTitle, authUserData, loggedIn, handleLogout }) {
  return (
    <header className="header">
      <div className="header__logo"></div>
      {loggedIn && <p className='header__text'>{authUserData.email}</p>}
      {loggedIn ? <button className='header__btn' type='button' onClick={handleLogout}>{linkTitle}</button> :
        <a className='header__link' href={`${window.location.origin}/${link}`}>{linkTitle}</a>
      }
    </header>
  );
}
  
export default Header;
