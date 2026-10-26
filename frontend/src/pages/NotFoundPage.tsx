import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section>
      <p>ERROR 404</p>
      <h1>This page does not exist</h1>
      <Link to="/catalog">Back to the catalog</Link>
    </section>
  )
}