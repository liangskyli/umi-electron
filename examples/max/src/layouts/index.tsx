import { Link, Outlet } from '@umijs/max';
import styles from './index.less';

export default function Layout() {
  return (
    <div className={styles.navs}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/docs">Docs</Link>
        </li>
        <li>
          <a href="https://github.com/liangskyli/umi-electron">Github</a>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
