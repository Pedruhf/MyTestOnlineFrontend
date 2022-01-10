import { useNavigate } from "react-router";

import styles from './styles.module.scss'
import ErrorPageImg from "../../assets/error_page.svg";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <main className={styles.content}>
      <p>OPS! PÁGINA NÃO ENCONTRADA</p>
      <img src={ErrorPageImg} alt="Not Found" />;
      <span>LAMENTAMOS, MAS A PAGINA SOLICITADA NÃO FOI ENCONTRADA</span>
      <button onClick={() => navigate('/')}>Voltar à pagina inicial</button>
    </main>
  );
}

export { ErrorPage }