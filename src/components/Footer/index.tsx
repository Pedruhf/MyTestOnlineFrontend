import { AiOutlineGithub, AiOutlineLinkedin } from "react-icons/ai";

import styles from "./styles.module.scss";

const Footer = () => {
  return (
    <footer className={styles.content}>
      <strong>MyTestOnline © 2021</strong>

      <div className={styles.contact}>
      <strong>Contato</strong>
        <div className={styles.socials}>
          <div className={styles.github}>
            <AiOutlineGithub />
            <a href="https://github.com/Pedruhf" rel="noreferrer" target="_blank">@Pedruhf</a>
          </div>
          <div className={styles.linkedin}>
            <AiOutlineLinkedin />
            <a href="https://www.linkedin.com/in/pedruhf/" rel="noreferrer" target="_blank">@pedruhf</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };