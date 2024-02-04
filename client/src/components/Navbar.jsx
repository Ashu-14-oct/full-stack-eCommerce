import React, { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";

export default function Navbar(){
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/');
  }

  useEffect(() => {
    if(localStorage.getItem('token')){
      setLoggedIn(true);
    }
  }, [navigate]);

    return(
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <Link className="navbar-brand" to="/">GoCart.com</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      
      {
        loggedIn? (<ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/cart">Cart</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/orders">Orders</Link>
        </li>
      </ul>) : (<></>)
      }
      {
        loggedIn? (<button className="btn btn-danger" type="submit" onClick={handleLogout}>Log out</button>) : (<></>)
      }
      
    </div>
  </div>
</nav>
        </div>
    )
}