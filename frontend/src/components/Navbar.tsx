import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav>
      <Link to="/catalog">Catalog</Link>
      <Link to="/plans">Plans</Link>

      {user ? (
        <>
          <span>Hi, {user.name}</span>
          <button type="button" onClick={logout}>
            Log out
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Log in</Link>
          <Link to="/register">Sign up</Link>
        </>
      )}
    </nav>
  )
}
