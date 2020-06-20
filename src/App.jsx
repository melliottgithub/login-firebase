import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Admin from "./components/Admin";
import { auth } from "./firebase";
import Reset from "./components/Reset";

function App() {
  const [fbUser, setFbUser] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setFbUser(user);
      } else {
        setFbUser(null);
      }
    });
  }, []);

  return fbUser !== false ? (
    <Router>
      <div className="container">
        <Navbar fbUser={fbUser}/>
        <Switch>
          <Route path="/login">
            <Login></Login>
          </Route>
          <Route path="/reset">
            <Reset></Reset>
          </Route>
          <Route path="/admin">
            <Admin></Admin>
          </Route>
          <Route path="/">home...</Route>
        </Switch>
      </div>
    </Router>
  ) : (
    <div className='container'><p>Cargando...</p></div>
  );
}

export default App;
