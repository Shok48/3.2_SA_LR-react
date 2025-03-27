import styles from './App.module.css'
import { Header } from 'antd/es/layout/layout'
import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Page } from './pages/Page/Page'
function App() {

  return (
    <Router>
        <Header className={styles.header}>
            <Link to="/" className={styles.link}>Главная</Link>
            <Link to="/LR-1" className={styles.link}>Конвертер</Link>
            <Link to="/LR-2" className={styles.link}>Иерархия</Link>
            <Link to="/LR-3" className={styles.link}>Подсистемы</Link>
        </Header>
        <Routes>
            {/* <Route path="/" element={<Page title="Главная" />} />
            <Route path="/LR-1" element={<Page title="Конвертер" />} /> */}
        </Routes>
    </Router>
  )
}

export default App
