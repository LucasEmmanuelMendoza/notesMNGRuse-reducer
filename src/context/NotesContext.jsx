import { createContext, useReducer } from "react";

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const initialState = {
    notes: [],
    selectedNote: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const reducer = (state, action) => {};

  return (
    <NotesContext.Provider value={{ state, dispatch }}>
      {children}
    </NotesContext.Provider>
  );
}; 
