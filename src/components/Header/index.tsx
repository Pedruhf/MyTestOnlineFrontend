import { useContext, useState } from "react";
import { FiUser } from "react-icons/fi";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.svg";
import { AuthContext } from "../../contexts/AuthContext";
import { MenuDropdown } from "../MenuDropdown";
import styles from "./styles.module.scss";

const Header = () => {
  const { user } = useContext(AuthContext);
  const [activeMenuDropdown, setActiveMenuDropdown] = useState<boolean>(false);

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img src={logoImg} alt="MyTestOnline" />
        <strong>MyTestOnline</strong>
      </Link>

      { user && 
        <div className={styles.user} onClick={() => setActiveMenuDropdown(true)}>
          { user.picture ? (
            <img src={user?.picture} alt="MyTestOnline" />
          )
          :
          (
            <div className={styles.defaultAvatar}>
              <FiUser />
            </div>
          )
        }
        {activeMenuDropdown ? (<MdArrowDropUp  />): (<MdArrowDropDown  />)}
        </div>
      }

      {activeMenuDropdown && <MenuDropdown onClose={() => setActiveMenuDropdown(false)} />}
    </header>
  );
}

export { Header };