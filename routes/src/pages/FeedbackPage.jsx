import { useState } from 'react'
import { useCreateFeedback, useFeedback } from '../hooks/useFeedback'
import StatusMessage from '../components/StatusMessage'

const emptyForm = { name: '', rating: '5', message: '' }

export default function FeedbackPage() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const { data: reviews, isPending } = useFeedback()
  const createFeedbackMutation = useCreateFeedback()
  const saving = createFeedbackMutation.isPending
  const submitError = createFeedbackMutation.error?.message

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setSuccess(false)
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const review = {
      name: form.name.trim(),
      rating: Number(form.rating),
      message: form.message.trim(),
    }
    createFeedbackMutation.mutate(review, {
      onSuccess: () => {
        setForm(emptyForm)
        setSuccess(true)
      },
    })
  }

  return (
    <section className="page-narrow">
      <h1>Feedback</h1>
      <p className="muted">Tell us what you think about AI Era Jobs. Reviews are saved in localStorage.</p>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Your name *
          <input className="input" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </label>
        <label>
          Rating
          <select className="input" name="rating" value={form.rating} onChange={handleChange}>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {'★'.repeat(r)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Message *
          <textarea className="input" rows="4" name="message" value={form.message} onChange={handleChange} />
          {errors.message && <span className="error-text">{errors.message}</span>}
        </label>
        {submitError && <p className="error-text">{submitError}</p>}
        {success && <p className="notice">Thank you! Your review was saved.</p>}
        <div className="form-actions">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Sending…' : 'Send feedback'}
          </button>
        </div>
      </form>

      <h2>Reviews</h2>
      {isPending && <StatusMessage type="loading" text="Loading reviews…" />}
      {reviews?.length === 0 && <StatusMessage type="empty" text="No reviews yet. Be the first!" />}
      {reviews?.map((r) => (
        <article key={r.id} className="review">
          <div className="card-top">
            <strong>{r.name}</strong>
            <span className="stars">{'★'.repeat(r.rating)}</span>
          </div>
          <p>{r.message}</p>
          <p className="muted small">{r.createdAt}</p>
        </article>
      ))}
    </section>
  )
}
