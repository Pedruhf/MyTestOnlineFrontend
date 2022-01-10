import { Link } from "react-router-dom";

import styles from "./styles.module.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";

type MenuDropdownProps = {
  onClose: () => void;
}

type DropdownItemProps = {
  text: string;
  to?: string;
}

const MenuDropdown = ({ onClose }: MenuDropdownProps) => {
  const { user, signOut } = useContext(AuthContext);
  const [element, setElement] = useState<HTMLDivElement>();
  const [menuDropdownSituation, setMenuDropdownSituation] = useState<string>("opening");

  function handleCloseModal(event: any): void {
    if (element && !element.contains(event.target)) {
      setMenuDropdownSituation("closing");

      setTimeout(() => {
        onClose();
      }, 300);
    }
  }

  useEffect(() => {
    setElement(document.getElementById("menuDropdown") as HTMLDivElement);

    document.addEventListener("click", handleCloseModal);

    return () => {
      document.removeEventListener("click", handleCloseModal);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element]);

  function DropdownItem(props: DropdownItemProps): JSX.Element {
    return (
      <Link to={props.to || "#"} className={styles.menuItem} onClick={handleCloseModal}>
        <span>{props.text}</span>
      </Link>
    );
  }

  return (
    <div id="menuDropdown" className={`${styles.menuDropdown} ${styles[`modal-${menuDropdownSituation}`]}`}>
      <DropdownItem text="Perfil" to="/perfil" />
      {user?.isProfessor && <DropdownItem text="Avaliações" to="/avaliacoes" />}
      <div onClick={signOut}>
        <DropdownItem text="Sair" />
      </div>
    </div>
  );
}

export { MenuDropdown };