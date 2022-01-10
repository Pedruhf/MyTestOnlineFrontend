import { PersonalInfo } from "./PersonalInfo";
import { FaUserAlt } from "react-icons/fa"
import { AiFillLock } from "react-icons/ai"

import styles from "./styles.module.scss";
import { useState } from "react";
import { ChangePassword } from "./ChangePassword";

const UserArea = () => {
  const [userAccountOptions, setUserAccountOptions] = useState<number>(0);

  return (
    <>
      <main className={styles.main}>
        <div className={styles.card}>
          <nav className={styles.nav}>
            <div
              className={`${styles.navItem} ${userAccountOptions === 0 && styles.active}`}
              onClick={() => setUserAccountOptions(0)}
            >
              <FaUserAlt />
              <strong>Informações pessoais</strong>
            </div>
            <div
              className={`${styles.navItem} ${userAccountOptions === 1 && styles.active}`}
              onClick={() => setUserAccountOptions(1)}
            >
              <AiFillLock />
              <strong>Alterar senha</strong>
            </div>
            <hr />
          </nav>
          {userAccountOptions === 0 && <PersonalInfo />}
          {userAccountOptions === 1 && <ChangePassword />}
        </div>
      </main>
    </>
  );
}

export { UserArea };