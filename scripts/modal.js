export function setModalHandler(backgroundElement, modalContainer) {
  const modalImageElement = modalContainer.querySelector("#modal-image");
  modalContainer.addEventListener(
    "click",
    (e) => {
      modalContainer.style.display = "none";
      backgroundElement.classList.remove("blur");
    },
    false
  );

  return (url) => {
    modalContainer.style.display = "flex";
    backgroundElement.classList.add("blur");
    modalImageElement.src = url;
  };
}
