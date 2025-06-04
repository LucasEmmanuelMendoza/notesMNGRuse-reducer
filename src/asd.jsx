{
  (() => {
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
      content = <>FORM</>;

      actionButton =
        state.idEditingNote !== null ? (
          <Button content="Save Note" handleClick={() => handleSaveNote()} />
        ) : (
          <Button content="Add Note" handleClick={() => handleAddNote()} />
        );
    }
    return (
      <>
        {content}
        {actionButton}
      </>
    );
  })();
}


{
  (() => {



  })();
}