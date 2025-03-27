import styles from './Page.module.css'

export const Page = ({title, children}) => {
    return (
        <div className={styles.page}>
            <h1 className={styles.title}>{title}</h1>
            {children}
        </div>
    )
}