import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <nav>
        <Link to="/#fodoole-dev">Home</Link> | 
        <Link to="/about#fodoole-dev">About</Link> | 
        <Link to="/contact#fodoole-dev">Contact</Link>
      </nav>
      <p>Home Page</p>
    </div>
  );
}

export default Home;