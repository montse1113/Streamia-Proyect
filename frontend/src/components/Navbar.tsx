import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Same look for every link in the navbar
const linkClass =
  'rounded-lg px-3 py-2 hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-black text-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
        <Link to="/catalog" className="mr-4 text-xl font-bold">
          Streamia
        </Link>
        <Link to="/catalog" className={linkClass}>Catalog</Link>
        <Link to="/plans" className={linkClass}>Plans</Link>

        {/* ml-auto pushes the session part to the right */}
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <span className="text-neutral-300">Hi, {user.name}</span>
              <button type="button" onClick={logout} className={`${linkClass} border border-neutral-700`}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>Log in</Link>
              <Link to="/register" className="rounded-lg bg-indigo-600 px-3 py-2 font-medium hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-white">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}