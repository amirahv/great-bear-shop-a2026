import { Link } from "react-router";

function HomePage() {
  return (
    <>
      <h1>Hello!</h1>
      <Link to={"/App"}>Go to main React Vite page</Link>
    </>
  );
}

export default HomePage;
