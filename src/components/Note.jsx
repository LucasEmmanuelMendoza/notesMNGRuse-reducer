export const Note = ({ title, text }) => (
  <div
    className=" border border-white d-flex gap-2 justify-content-center align-items-center"
    onClick={() => {}}>
    <h1>{title}</h1>
    <span>{text}</span>
  </div>
);
