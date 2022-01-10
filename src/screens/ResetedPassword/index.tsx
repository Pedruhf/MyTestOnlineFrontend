import { IoIosCheckmarkCircleOutline } from "react-icons/io"
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

const ResetedPassword = () => {
  return(
    <main className={styles.container}>
      <div className={styles.card}>
        <IoIosCheckmarkCircleOutline />
        <h1>Senha resetada com sucesso!</h1>
        <p>Uma senha temporária foi enviada para seu e-mail</p>
        <p>Você poderá altera-la quando quiser através da nossa plataforma</p>
        <p>Faça seu <Link to="/auth">Login</Link> e comece a utilizar nossa plataforma</p>
      </div>
    </main>
  );
}

export { ResetedPassword };