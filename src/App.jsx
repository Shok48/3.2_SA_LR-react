import styles from './App.module.css'
import { Header } from 'antd/es/layout/layout'
import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Page from './pages/Page/Page'
import HomePage from './pages/HomePage/HomePage'
import ConverterPage from './pages/ConverterPage/ConverterPage'
import HierarchyPage from './pages/HierarchyPage/HierarchyPage'
import SubsistemsPage from './pages/SubsistemsPage/SubsistemsPage'
import '@ant-design/v5-patch-for-react-19';

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
            <Route path="/" element={<HomePage/>} />
            <Route path="/LR-1" element={<ConverterPage/>} />
            <Route path="/LR-2" element={<HierarchyPage/>} />
            <Route path="/LR-3" element={<SubsistemsPage/>} />
        </Routes>
    </Router>
  )
}

export default App
