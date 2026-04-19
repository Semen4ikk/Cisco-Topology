"use client"
import TopologyGraph from "@/components/topology/topologyGraph";
import styles from './page.module.css';
export default function Home() {
    const handleResetLayout = () => {
        localStorage.removeItem('topology-graph-state');
        window.location.reload();
    };
    return (
        <div>
            <main>
                <h1>Топология</h1>
                <button
                    className={styles.resetButton}
                    onClick={handleResetLayout}
                    type="button"
                >
                    Сбросить
                </button>
                <TopologyGraph />
            </main>
        </div>
    );
}