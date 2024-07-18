import { Link } from 'react-router-dom';

function Contact() {
  return (
    <div>
      <nav>
        <Link to="/#fodoole-dev">Home</Link> | 
        <Link to="/about#fodoole-dev">About</Link> | 
        <Link to="/contact#fodoole-dev">Contact</Link>
      </nav>
      <p>Contact Page</p>
    </div>
  );
}

export default Contact;