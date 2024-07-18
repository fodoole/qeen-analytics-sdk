import { Link } from 'react-router-dom';

function About() {
  return (
    <div>
      <nav>
        <Link to="/#fodoole-dev">Home</Link> | 
        <Link to="/about#fodoole-dev">About</Link> | 
        <Link to="/contact#fodoole-dev">Contact</Link>
      </nav>
      <p>About Page</p>
    </div>
  );
}

export default About;