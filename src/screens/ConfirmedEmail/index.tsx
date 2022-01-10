import { IoIosCheckmarkCircleOutline } from "react-icons/io"
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

const ConfirmedEmail = () => {
  return(
    <main className={styles.container}>
      <div className={styles.card}>
        <IoIosCheckmarkCircleOutline />
        <h1>Tudo certo!</h1>
        <p>Seu e-mail foi confirmado com sucesso</p>
        <p>Faça seu <Link to="/auth">Login</Link> e comece a utilizar nossa plataforma</p>
      </div>
    </main>
  );
}

export { ConfirmedEmail };