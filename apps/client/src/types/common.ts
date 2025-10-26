export type AlertType = 'info' | 'warning' | 'error' | 'success';

export interface ModalProps {
  setIsOpen: (isOpen: boolean) => void;
}