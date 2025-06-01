import { useReducer, useState } from "react";
import "./App.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";

const Button = ({ content, handleClick, className }) => (
  <button className={className} onClick={handleClick}>
    {content}
  </button>
);

const Note = ({ title, text, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="border border-white d-flex gap-2 p-2 justify-content-between align-items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="d-flex gap-2 align-items-center ms-2">
        <h3>{title}</h3>
        {text.length > 5 ? <>{text.slice(5)}...</> : <span>{text}</span>}
      </div>
      <div className="me-2 d-flex gap-1">
        {isHovered && (
          <Button
            content={"✏️"}
            className="btn btn-warning"
            handleClick={onEdit}
          />
        )}
        {isHovered && (
          <Button
            content={"❌"}
            className="btn btn-danger"
            handleClick={onDelete}
          />
        )}
      </div>
    </div>
  );
};

const NotesContainer = ({ notes, onDeleteNote, onEditNote }) => {
  return (
    <div className="d-flex flex-column gap-1">
      {notes.map((note) => (
        <Note
          key={note.id}
          title={note.title}
          text={note.text}
          onEdit={() => onEditNote(note.id)}
          onDelete={() => onDeleteNote(note.id)}
        />
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
    idEditingNote: null,
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
            inputTitle: "",
            inputText: "",
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

      case "SET_ADD_NEW_FORM":
        return {
          ...state,
          inputTitle: "",
          inputText: "",
          idEditingNote: null,
        };

      case "DELETE_NOTE":
        const filteredNotes = state.notes.filter(
          (note) => note.id != action.value
        );
        /*         if (action.value === state.idSelectedNote) {
          return {
            ...state,
            idSelectedNote: null,
          };
        } */
        if (action.value === state.idEditingNote) {
          return {
            ...state,
            inputTitle: "",
            inputText: "",
            idEditingNote: null,
            notes: filteredNotes,
          };
        }
        return {
          ...state,
          notes: filteredNotes,
        };
      case "SET_UPDATE_FORM":
        const editingNote = state.notes.find(
          (note) => note.id === action.value
        );
        return {
          ...state,
          idEditingNote: action.value,
          inputTitle: editingNote.title,
          inputText: editingNote.text,
        };

      case "UPDATE_NOTE":
        const moddedNotes = state.notes.map((note) => {
          if (note.id === state.idEditingNote) {
            return {
              ...note,
              idEditingNote: null,
              title: state.inputTitle,
              text: state.inputText,
            };
          } else {
            return note;
          }
        });

        return {
          ...state,
          notes: moddedNotes,
        };
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleDeleteNote = (id) => {
    dispatch({
      type: "DELETE_NOTE",
      value: id,
    });
  };

  const handleEditNote = (id) => {
    dispatch({
      type: "SET_UPDATE_FORM",
      value: id,
    });
  };

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: e.target.name,
      value: e.target.value,
    });
  };

  return (
    <div className="mainView mb-3">
      <h1>Notes Manager</h1>
      <Row>
        <Col md={7}>
          <>
            <div className="mb-3">
              <input
                type="text"
                name="inputTitle"
                value={state.inputTitle}
                placeholder="Write a Title"
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <textarea
                type="text"
                name="inputText"
                placeholder="Write a Note"
                value={state.inputText}
                onChange={handleChange}
                className="form-control"
                rows={4}
              />
            </div>
          </>

          {state.idEditingNote !== null ? (
            <Button
              content="Save Note"
              handleClick={() =>
                dispatch({
                  type: "UPDATE_NOTE",
                })
              }
            />
          ) : (
            <Button
              content="Add Note"
              handleClick={() =>
                dispatch({
                  type: "ADD_NOTE",
                })
              }
            />
          )}
        </Col>

        <Col md={5} className="d-flex flex-column">
          <div className="d-flex justify-content-end mb-3">
            <Button
              handleClick={() => {
                dispatch({ type: "SET_ADD_NEW_FORM" });
              }}
              content="+"
            />
          </div>
          <div className="flex-grow-1 overflow-auto">
            <NotesContainer
              notes={state.notes}
              onDeleteNote={handleDeleteNote}
              onEditNote={handleEditNote}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default NotesManager;
