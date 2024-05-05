import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1> Welcome to Hospital Management System</h1>
      </div>

      <div className={styles.grid}>
        <a
          href="/patients"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Patients Management System <span>-&gt;</span>
          </h2>
          <p>Manage patients and their appointments</p>
        </a>

        <a
          href="/doctors"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Doctors Management System <span>-&gt;</span>
          </h2>
          <p>Manage doctors and their availability</p>
        </a>

        <a
          href="/appointments"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Appointments Management System <span>-&gt;</span>
          </h2>
          <p>Manage appointments between patients and doctors</p>
        </a>
      </div>
    </main>
  );
}
