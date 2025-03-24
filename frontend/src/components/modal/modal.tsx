import styles from "./modal.module.css";

interface ModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const Modal = ({
  title,
  description,
  isOpen,
  loading,
  onConfirm,
  onClose,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.containerModal}>
        <h3 className={styles.h3}>{title}</h3>
        {description && (
          <text className={styles.description}>{description}</text>
        )}
        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.confirmButton}`}
            disabled={loading}
            onClick={onConfirm}
          >
            <span className={styles.buttonContent}>
              <span>Confirmar</span>
              {loading && <span className={styles.spinner}></span>}
            </span>
          </button>

          <button
            className={`${styles.button} ${styles.cancelButton}`}
            disabled={loading}
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
