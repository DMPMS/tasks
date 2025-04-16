import { useState } from "react";
import styles from "./modalDeleteUser.module.css";

interface ModalDeleteUserProps {
  title: string;
  description?: string;
  isOpen: boolean;
  loading: boolean;
  warningFields: string[];
  invalidFields: string[];
  onConfirm: () => void;
  onClose: () => void;
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
}

const ModalDeleteUser = ({
  title,
  description,
  isOpen,
  loading,
  warningFields,
  invalidFields,
  onConfirm,
  onClose,
  onChangeInput,
}: ModalDeleteUserProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  if (!isOpen) return null;

  const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    onChangeInput(e, "deletePassword");
  };

  const handleOnDelete = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue) {
      onConfirm();
    }
  };

  const handleOnCancel = () => {
    setInputValue("");

    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.containerModal}>
        <h3 className={styles.h3}>{title}</h3>
        {description && (
          <text className={styles.description}>{description}</text>
        )}

        <form onSubmit={handleOnDelete} className={styles.form}>
          <input
            id="deletePassword"
            type="password"
            placeholder="••••••••"
            onChange={handleOnChangeInput}
            className={`${styles.field} ${
              warningFields.includes("deletePassword")
                ? styles.warningField
                : ""
            } ${
              invalidFields.includes("deletePassword")
                ? styles.invalidField
                : ""
            }`}
            disabled={loading}
          />

          <div className={styles.actions}>
            <button
              type="submit"
              className={`${styles.button} ${styles.confirmButton}`}
              disabled={loading || !inputValue}
              onClick={onConfirm}
            >
              <span className={styles.buttonContent}>
                <span>Confirmar</span>
                {loading && <span className={styles.spinner}></span>}
              </span>
            </button>

            <button
              type="button"
              className={`${styles.button} ${styles.cancelButton}`}
              disabled={loading}
              onClick={handleOnCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalDeleteUser;
