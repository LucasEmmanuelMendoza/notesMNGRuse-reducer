import { useReducer } from "react";
import "./App.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "../src/components/Button.jsx";
import { NotesContainer } from "../src/components/NotesContainer.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

function NotesManager() {
  const initialState = {
    id: 0,
    notes: [
      { title: "asd", text: "a" },
      { title: "hola", text: "lucas" },
      { title: "asdasdasd", text: "asdasdsad" },
      { title: "si", text: "hola buenas" },
    ],
    inputTitle: "",
    inputText: "",
    idSelectedNote: null,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_FIELD":
        return {
          ...state,
          [action.field]: action.value,
        };

      case "ADD_NOTE":
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

  return (
    <div className="mainView mb-3">
      Notes Manager
      <Row>
        {/* Columna izquierda: input, textarea y botón */}
        <Col md={6}>
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
        </Col>

        {/* Columna derecha: botón + y NotesContainer */}
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
