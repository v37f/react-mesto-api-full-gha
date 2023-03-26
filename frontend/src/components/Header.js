import headerLogoPath from '../images/header__logo.svg';

import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

function Header({ accountData, onSignOut, isSmallScreen, isTopBarOpen, onMenuClick }) {
 
  return (
    <header className="header">
      <img className="header__logo" src={headerLogoPath} alt="Логотип Mesto" />
      <Routes>
        <Route path="/sign-in" element={<Link className="header__link" to="/sign-up">Регистрация</Link>} />
        <Route path="/sign-up" element={<Link className="header__link" to="/sign-in">Войти</Link>} />
        <Route 
          path="/"
          element={
            <div className="header__nav-container">
            {isSmallScreen
              ? <button className={"header__button" + (isTopBarOpen ? " header__button_type_close": " header__button_type_menu")} onClick={onMenuClick} />
              : <>
                  <p className="header__profile-email">{accountData?.accountEmail}</p>
                  <button className="header__button" onClick={onSignOut}>Выйти</button>
                </>
            }
          </div>}  
        />
      </Routes>
    </header>
  );
}

export default Header;