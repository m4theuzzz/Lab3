import { useState } from "react";

const useModal = () => {
  const [open, setOpen] = useState(false);
  const [identifier, setIdentifier] = useState<any>(null);

  const closeModal = () => {
    setOpen(false);

    setTimeout(() => {
      // delay devido a animacao de fechar a modal
      setIdentifier(null);
    }, 500);
  };

  const openModal = (id?: any) => {
    setOpen(true);
    !!id && setIdentifier(id);
  };

  const modal = {
    isOpen: open,
    open: openModal,
    close: closeModal,
    elementClicked: identifier,
  };

  return modal;
};

export default useModal;
