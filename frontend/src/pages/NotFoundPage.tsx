import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="py-16 text-center">
      <p className="text-sm font-semibold text-indigo-600">ERROR 404</p>
      <h1 className="mt-2 text-3xl font-bold">This page does not exist</h1>
      <Link
        to="/catalog"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Back to the catalog
      </Link>
    </section>
  )
}