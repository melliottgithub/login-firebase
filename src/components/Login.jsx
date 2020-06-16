import React, { useState, useCallback } from "react";
import { auth, db } from "../firebase";
import { withRouter } from "react-router-dom";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null);
  const [isRegister, setIsRegister] = useState(true);

  const processData = (e) => {
    e.preventDefault();
    if (!email.trim() || !pass.trim()) {
      setError("Ingrese Email");

      return;
    }
    if (!pass.trim()) {
      setError("Ingrese Password");
      return;
    }
    if (pass.length < 6) {
      console.log(" 6 or less");

      setError("Ingrese 6 caracteres o mas");
      return;
    }
    setError(null);

    if (isRegister) {
      registrar();
    } else {
      login();
    }
  };

  const login = useCallback(async () => {
    try {
      const res = await auth.signInWithEmailAndPassword(email, pass);
      console.log(res.user);
      setEmail("");
      setPass("");
      setError(null);
      props.history.push("/admin");
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setError("Email no valido");
      }
      if (error.code === "auth/user-not-found") {
        setError("Email no registrado");
      }
      if (error.code === "auth/wrong-password") {
        setError("Contrasena incorrecta");
      }
    }
  }, [email, pass, props.history]);

  const registrar = useCallback(async () => {
    try {
      const res = await auth.createUserWithEmailAndPassword(email, pass);
      await db.collection("usuarios").doc(res.user.email).set({
        email: res.user.email,
        uid: res.user.uid,
      });

      setEmail("");
      setPass("");
      setError(null);
      props.history.push("/admin");
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-email") {
        setError("Email no valido");
      }
      if (error.code === "auth/email-already-in-use") {
        setError("Email ya utilizado");
      }
    }
  }, [email, pass, props.history]);

  return (
    <div className="mt-5">
      <h3 className="text-center">
        {isRegister ? "Registro de usuarios" : "Login de acceso"}
      </h3>
      <hr />
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-xl-4">
          <form onSubmit={processData} autoComplete="on">
            {error && <div className="alert alert-danger">{error}</div>}
            <input
              type="email"
              className="form-control mb-2"
              placeholder="Ingrese un email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              autoComplete="on"
              type="password"
              className="form-control mb-2"
              placeholder="Ingrese un password"
              onChange={(e) => setPass(e.target.value)}
              value={pass}
            />
            <button type="submit" className="btn btn-dark btn-lg btn-block">
              {isRegister ? "Registrarse" : "Acceder"}
            </button>
            <button
              onClick={() => setIsRegister(!isRegister)}
              type="button"
              className="btn btn-info btn-sm btn-block"
            >
              {isRegister ? "Ya tienes cuenta?" : "No tienes cuenta?"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
