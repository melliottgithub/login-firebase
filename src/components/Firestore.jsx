import React, { useEffect, useState } from "react";
import { db } from "../firebase";

import moment from "moment";

function App(props) {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");

  const [error, setError] = useState(null);

  const [last, setLast] = useState(null);
  const [deactiv, setDeactiv] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setDeactiv(true);

        const data = await db
          .collection(props.user.uid)
          .limit(2)
          .orderBy("date", "desc")
          .get();
        const arrayData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLast(data.docs[data.docs.length - 1]);

        console.log(arrayData);
        setTasks(arrayData);

        const query = await db
          .collection(props.user.uid)
          .limit(2)
          .orderBy("date", "desc")
          .startAfter(data.docs[data.docs.length - 1])
          .get();

        if (query.empty) {
          console.log("No more tasks");
          setDeactiv(true);
        } else {
          setDeactiv(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [props.user.uid]);

  const next = async () => {
    console.log("next");
    try {
      const data = await db
        .collection(props.user.uid)
        .limit(2)
        .orderBy("date", "desc")
        .startAfter(last)
        .get();
      const arrayData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks([...tasks, ...arrayData]);
      setLast(data.docs[data.docs.length - 1]);
      const query = await db
        .collection(props.user.uid)
        .limit(2)
        .orderBy("date", "desc")
        .startAfter(data.docs[data.docs.length - 1])
        .get();

      if (query.empty) {
        console.log("No more tasks");
        setDeactiv(true);
      } else {
        setDeactiv(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addHandler = async (e) => {
    e.preventDefault();
    if (!task.trim()) {
      setError("Add a task before submitting");

      return;
    }
    try {
      const newTask = {
        name: task,
        date: Date.now(),
      };

      const data = await db
        .collection(props.user.uid)
        .add({ name: task, date: Date.now() });

      setTasks([...tasks, { id: data.id, ...newTask }]);
      setError(null);
      setTask("");
    } catch (error) {}
  };

  const deleteHandler = async (id) => {
    try {
      await db.collection(props.user.uid).doc(id).delete();

      const arrayFilter = tasks.filter((item) => item.id !== id);
      setTasks(arrayFilter);
    } catch (error) {}
  };

  const actEditHandler = (item) => {
    setEdit(true);
    setTask(item.name);
    setId(item.id);
  };

  const editHandler = async (e) => {
    e.preventDefault();
    if (!task.trim()) {
      setError("Add a task before submitting");

      return;
    }
    try {
      await db.collection(props.user.uid).doc(id).update({ name: task });

      const arrayEdited = tasks.map((item) =>
        item.id === id ? { id: item.id, date: item.date, name: task } : item
      );
      setTasks(arrayEdited);

      setEdit(false);
      setId("");
      setTask("");
      setError(null);
    } catch (error) {}
  };

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <h3>{edit ? "Editing Grocery List" : "Grocery list"}</h3>
          <ul className="list-group">
            {tasks.map((item) => (
              <li className="list-group-item" key={item.id}>
                {item.name} - {moment(item.date).format("MMM Do YY")}
                <button
                  onClick={edit ? null : () => deleteHandler(item.id)}
                  className={
                    edit
                      ? "btn btn-danger btn-sm float-right disabled"
                      : "btn btn-danger btn-sm float-right"
                  }
                >
                  Delete
                </button>
                <button
                  onClick={edit ? null : () => actEditHandler(item)}
                  className="btn btn-warning mr-2 btn-sm float-right"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => next()}
            className="btn btn-info btn-block mt-2 btn-small"
            disabled={deactiv}
          >
            next
          </button>
        </div>
        <div className="col-md-6">
          <h3>{edit ? "Edit item" : "Add item"}</h3>

          <form onSubmit={edit ? editHandler : addHandler}>
            {error ? (
              <span className="text-danger">
                Write something before submitting.
              </span>
            ) : null}
            <input
              type="text"
              placeholder="Enter item"
              className="form-control mb-2"
              onChange={(e) => setTask(e.target.value)}
              value={task}
            />
            <button
              type="submit"
              className={
                edit ? "btn btn-warning btn-block" : "btn btn-dark btn-block"
              }
            >
              {edit ? "Submit Edit" : "Add"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
