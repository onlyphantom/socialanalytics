// create layout with sidebar to wrap around different pages
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";

import { useLogin } from "../context/UserContext";
import styles from "../styles/Home.module.css";

const Layout = ({ children, activePage }) => {
  const { logoutUser } = useLogin();

  return (
    <div className="drawer drawer-mobile">
      <input id="side-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <Head>
          <title>Social Media Analytics</title>
          <meta name="description" content="Social Media Analytics by Supertype" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <div>
            <label
              htmlFor="side-drawer"
              className="btn btn-primary drawer-button lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
            <div className="flex flex-col mt-6">
              {children}
            </div>
          </div>
        </main>

      </div>

      <div className="drawer-side">
        <label htmlFor="side-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
          <Link href="/">
            <a>
              <span className={styles.logo}>
                <Image
                  src="/bi-b.png"
                  alt="Bank Indonesia Logo"
                  width={220.1}
                  height={65}
                />
              </span>
            </a>
          </Link>

          <li className={activePage === "overview" ? "rounded-lg bg-gray-700" : ""}>
            <Link href="/overview">
              <a>Overview</a>
            </Link>
          </li>

          <li className={activePage === "facebook" ? "rounded-lg bg-gray-700" : ""}>
            <Link href="/facebook">
              <a>Facebook</a>
            </Link>
          </li>

          <li className={activePage === "instagram" ? "rounded-lg bg-gray-700" : ""}>
            <Link href="/instagram">
              <a>Instagram</a>
            </Link>
          </li>

          <li className={activePage === "twitter" ? "rounded-lg bg-gray-700" : ""}>
            <Link href="/twitter">
              <a>Twitter</a>
            </Link>
          </li>

          <li className={activePage === "youtube" ? "rounded-lg bg-gray-700" : ""}>
            <Link href="/youtube">
              <a>YouTube</a>
            </Link>
          </li>

          <li className="absolute bottom-3">
            <button onClick={() => {
              logoutUser();
              setTimeout(() => Router.push("/login"), 2000);
            }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <a>Logout</a>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Layout;
