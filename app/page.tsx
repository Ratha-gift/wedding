import LoginPage from "../login/login";   // ← probably ok
// import Page from "../Homepage/page";     // ← this name is dangerous

// export function Page() {                           // ←←← PROBLEM HERE
//   return <HomePage />;
// }

export default function HomePage() {
  return <LoginPage />;
}