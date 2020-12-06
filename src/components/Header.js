import React from 'react';

function Header({ style, children }) {
  return (
    <header style={style} className="header">
      <div className="header__logo"></div>
      {children}
    </header>
  );
}
  
export default Header;
