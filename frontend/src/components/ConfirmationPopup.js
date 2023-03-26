import PopupWithForm from "./PopupWithForm"

function ConfirmationPopup({ card, isOpen, onClose, onConfirm }) {

  function handleSubmit(e) {
    e.preventDefault();
    onConfirm(card);
  } 

  return (
    <PopupWithForm title="Вы уверены?" name="confirm" buttonText="Да" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} />
  )
}

export default ConfirmationPopup;