import { useReducer } from "react";
import "./App.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";

const Button = ({ content, handleClick }) => (
  <button onClick={handleClick}>{content}</button>
);

const Note = ({ title, text }) => (
  <div
    className=" border border-white d-flex gap-2 justify-content-center align-items-center"
    onClick={() => {}}
  >
    <h1>{title}</h1>
    <span>{text}</span>
  </div>
);

const NotesContainer = ({ notes }) => {
  return (
    <div>
      {notes.map((note) => (
        <Note key={note.id} title={note.title} text={note.text} />
      ))}
    </div>
  );
};

function NotesManager() {
  const initialState = {
    id: 5,
    notes: [
      { id: 1, title: "asd", text: "a" },
      { id: 2, title: "hola", text: "lucas" },
      { id: 3, title: "asdasdasd", text: "asdasdsad" },
      { id: 4, title: "si", text: "hola buenas" },
    ],
    inputTitle: "",
    inputText: "",
    idSelectedNote: null,
    isEditingNote: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_FIELD":
        return {
          ...state,
          [action.field]: action.value,
        };

      case "ADD_NOTE":
        if (state.inputTitle !== "" && state.inputText !== "") {
          return {
            ...state,
            notes: [
              ...state.notes,
              {
                title: `${state.inputTitle}`,
                text: `${state.inputText}`,
              },
            ],
          };
        } else {
          return state;
        }
      case "UPDATE_NOTE":
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleClickNote = (e) => {};

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: e.target.name,
      value: e.target.value,
    });
  };

  return (
    <div className="mainView mb-3">
      Notes Manager
      <Row>
        <Col md={6}>
          {state.isEditingNote ? (
            <>asd</>
          ) : (
            <>
              <div className="mb-3">
                <input
                  type="text"
                  name="inputTitle"
                  placeholder="Write a Title"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <textarea
                  name="inputText"
                  placeholder="Write a Note"
                  value={state.inputText}
                  onChange={handleChange}
                  className="form-control"
                  rows={4}
                />
              </div>
              <Button
                content="Add Note"
                handleClick={() =>
                  dispatch({
                    type: "ADD_NOTE",
                  })
                }
              />
            </>
          )}
        </Col>

        <Col md={6} className="d-flex flex-column">
          <div className="d-flex justify-content-end mb-3">
            <Button content="+" />
          </div>
          <div className="flex-grow-1 overflow-auto">
            <NotesContainer notes={state.notes} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default NotesManager;
