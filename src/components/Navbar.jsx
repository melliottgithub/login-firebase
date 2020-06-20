import React from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import { auth } from "../firebase";

const Navbar = (props) => {
  const logout = () => {
    auth.signOut().then(() => {
      props.history.push("/login");
    });
  };

  return (
    <div className="navbar navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        Aut
      </Link>
      <div>
        <div className="d-flex">
          <NavLink className="btn btn-dark mr-2" to="/" exact>
            Inicio
          </NavLink>
          {props.fbUser !== null ? (
            <NavLink className="btn btn-dark mr-2" to="/admin">
             Virtual
            </NavLink> 
          ) : null}
          {props.fbUser !== null ? (
            <button onClick={() => logout()} className="btn btn-dark">
              Cerrar Sesion
            </button>
          ) : (
            <NavLink className="btn btn-dark mr-2" to="/login">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Navbar);
