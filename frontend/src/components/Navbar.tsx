import { Link } from 'react-router-dom'

export function Navbar() {
  return (
    <nav>
      <Link to="/catalog">Catalog</Link>
      <Link to="/plans">Plans</Link>
      <Link to="/login">Log in</Link>
      <Link to="/register">Sign up</Link>
    </nav>
  )
}