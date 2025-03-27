import Page from '../Page/Page'
import styles from './HomePage.module.css'

const HomePage = () => {
    const title = 'Главная страница'
    
    return (
        <Page title={title}>
            <div className={styles.homePage}>
                <span>Здесь будут собираться и храниться все лабораторные работы по Системному анализу. Каждая ЛР будет выделена в отдельную ссылку в шапке данного сайта. Все ЛР будут реализованы на React-JS</span>
            </div>
        </Page>
    )
}

export default HomePage;
