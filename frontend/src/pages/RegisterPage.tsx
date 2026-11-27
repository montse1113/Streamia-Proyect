import { useState, type SubmitEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { useAuth } from '../context/AuthContext' // Access the login function from AuthContext to log in after registering
import {
  cardClass, errorClass, footerClass, formClass, hintClass, inputClass,
  labelClass, linkClass, submitClass, titleClass,
} from '../components/formStyles'

export function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // page to go back to after signing up (comes from the login), or the catalog
  const from = (location.state as { from?: string } | null)?.from ?? '/catalog'

  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await register({ name, lastName, email, password })
      // the account was created, so we log in with the same data
      await login({ email, password })
      navigate(from)
    } catch (err) {
      // invalid data (400), email already registered (409) or no connection
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={cardClass}>
      <h1 className={titleClass}>Sign up</h1>

      <form onSubmit={handleSubmit} className={formClass}>
        <label htmlFor="name" className={labelClass}>Name</label>
        <input
          id="name"
          type="text"
          autoComplete="given-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className={inputClass}
        />

        <label htmlFor="lastName" className={labelClass}>Last name</label>
        <input
          id="lastName"
          type="text"
          autoComplete="family-name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          required
          className={inputClass}
        />

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
          autoComplete="new-password"
          aria-describedby="password-hint"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className={inputClass}
        />
        <small id="password-hint" className={hintClass}>At least 8 characters and one number.</small>

        {error && <p role="alert" className={errorClass}>{error}</p>}

        <button type="submit" disabled={isSubmitting} className={submitClass}>
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <p className={footerClass}>
        Already have an account? <Link to="/login" state={{ from }} className={linkClass}>Log in</Link>
      </p>
    </section>
  )
}
