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

const Note = ({ title, text, onEdit, onDelete, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="note border border-white d-flex gap-2 p-2 justify-content-between align-items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div onClick={onSelect} className="d-flex gap-2 align-items-center ms-2">
        <h4>{title}</h4>
        {text.length > 5 ? <>{text.slice(0, 5)}...</> : <>{text}</>}
      </div>
      <div className="me-1 d-flex gap-1">
        {isHovered && (
          <Button
            content={"✏️"}
            className="btn btn-warning btnEdit"
            handleClick={onEdit}
          />
        )}
        {isHovered && (
          <Button
            content={"❌"}
            className="btn btn-danger btnDelete"
            handleClick={onDelete}
          />
        )}
      </div>
    </div>
  );
};

const NotesContainer = ({ notes, onDeleteNote, onEditNote, onSelectNote }) => {
  return (
    <div className="d-flex flex-column gap-1 notesContainer border border-white">
      {notes.map((note) => (
        <Note
          key={note.id}
          title={note.title}
          text={note.text}
          onEdit={() => onEditNote(note.id)}
          onDelete={() => onDeleteNote(note.id)}
          onSelect={() => onSelectNote(note.id)}
        />
      ))}
    </div>
  );
};

const NoteView = ({ title, text }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
};

function NotesManager() {
  const initialState = {
    id: 5,
    notes: [
      { id: 1, title: "asd", text: "a" },
      { id: 2, title: "hola", text: "lucas" },
      { id: 4, title: "si", text: "hola buenas" },
    ],
    inputTitle: "",
    inputText: "",
    idSelectedNote: null,
    idEditingNote: null,
    selectedNote: {},
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_FIELD":
        return {
          ...state,
          [action.field]: action.value,
        };

      case "ADD_NOTE":
        if (state.inputTitle.trim() !== "" && state.inputText.trim() !== "") {
          return {
            ...state,
            id: `${state.id + 1}`,
            inputTitle: "",
            inputText: "",
            notes: [
              ...state.notes,
              {
                id: `${state.id + 1}`,
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
          idSelectedNote: null,
        };

      case "DELETE_NOTE":
        const filteredNotes = state.notes.filter(
          (note) => note.id != action.value
        );
        if (action.value === state.idSelectedNote) {
          return {
            ...state,
            idSelectedNote: null,
            inputTitle: "",
            inputText: "",
            notes: filteredNotes,
          };
        }
        if (action.value === state.idEditingNote) {
          return {
            ...state,
            inputTitle: "",
            inputText: "",
            notes: filteredNotes,
            idEditingNote: null,
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
              idSelectedNote: null,
            };
          } else {
            return note;
          }
        });

        return {
          ...state,
          notes: moddedNotes,
        };

      case "SELECT_NOTE":
        const foundNote = state.notes.find((note) => note.id === action.value);
        return {
          ...state,
          idEditingNote: null,
          idSelectedNote: action.value,
          selectedNote: foundNote,
        };
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: e.target.name,
      value: e.target.value,
    });
  };

  const handleSelectNote = (id) => {
    dispatch({
      type: "SELECT_NOTE",
      value: id,
    });
  };

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

  const handleAddNote = () => {
    dispatch({
      type: "ADD_NOTE",
    });
  };

  const handleSaveNote = () => {
    dispatch({
      type: "UPDATE_NOTE",
    });
  };

  return (
    <div className="mainView mb-3">
      <h1>Notes Manager</h1>
      <Row>
        <Col md={7}>
          {/* Esto se llama una Immediately Invoked Function Expression (IIFE) dentro de JSX. 
          Es decir, una función flecha que se ejecuta al instante. La usamos así dentro de JSX 
          cuando queremos meter bloques de lógica compleja que normalmente no se pueden usar 
          directamente en JSX, como un if con varias ramas. */}
          {(() => {
            let content;
            let actionButton;

            // Si hay una nota seleccionada y NO se está editando => mostrar solo la nota
            if (state.idSelectedNote !== null && state.idEditingNote === null) {
              content = (
                <div>
                  <h2>{state.selectedNote.title}</h2>
                  <p>{state.selectedNote.text}</p>
                </div>
              );

              actionButton = null;
            } else {
              // content = <InputNote changeFunction={handleChange} />;
              /*Error: La función InputNote está definida dentro del componente NotesManager, y accede 
              directamente a state.inputTitle y state.inputText. Pero React no permite que un componente
              acceda a props que no se le pasaron. Como InputNote está usando state.inputTitle directamente,
              debería apsarle esas props también si quiero que sea reutilizable. */
              content = (
                <div>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="inputTitle"
                      value={state.inputTitle}
                      placeholder="Write a Title"
                      onChange={handleChange}
                      className="form-control"
                      maxLength={6}
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      name="inputText"
                      value={state.inputText}
                      placeholder="Write a Note"
                      onChange={handleChange}
                      className="form-control"
                      rows={10}
                    />
                  </div>
                </div>
              );

              actionButton =
                state.idEditingNote !== null ? (
                  <Button
                    content="Save Note"
                    handleClick={() => handleSaveNote()}
                  />
                ) : (
                  <Button
                    content="Add Note"
                    handleClick={() => handleAddNote()}
                  />
                );
            }
            return (
              <>
                {content}
                {actionButton}
              </>
            );
          })()}
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
          <NotesContainer
            notes={state.notes}
            onDeleteNote={handleDeleteNote}
            onEditNote={handleEditNote}
            onSelectNote={handleSelectNote}
          />
        </Col>
      </Row>
    </div>
  );
}

export default NotesManager;
