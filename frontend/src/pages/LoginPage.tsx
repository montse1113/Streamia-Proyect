import { useState, type SubmitEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  cardClass, errorClass, footerClass, formClass, inputClass,
  labelClass, linkClass, submitClass, titleClass,
} from '../components/formStyles'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // page to go back to after logging in (PlansPage sends it), or the catalog
  const from = (location.state as { from?: string } | null)?.from ?? '/catalog'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault() // prevents the page from reloading
    setError(null)
    setIsSubmitting(true)

    try {
      await login({ email, password }) // function from AuthContext
      navigate(from) // back to where the user was, or the catalog
    } catch (err) {
      // wrong email or password (401), too many tries (429) or no connection
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false) // avoid the button to be disabled forever if an error occurs
    }
  }

  return (
    <section className={cardClass}>
      <h1 className={titleClass}>Log in</h1>

      <form onSubmit={handleSubmit} className={formClass}>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className={inputClass}
        />

        <label htmlFor="password" className={labelClass}>Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className={inputClass}
        />

        {error && <p role="alert" className={errorClass}>{error}</p>}

        <button type="submit" disabled={isSubmitting} className={submitClass}>
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className={footerClass}>
        Don't have an account? <Link to="/register" state={{ from }} className={linkClass}>Sign up</Link>
      </p>
    </section>
  )
}
