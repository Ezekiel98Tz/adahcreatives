import React, { useState } from 'react'

type Props = { onSubmit: (data: { name: string; email: string; message?: string }) => Promise<void> }

export default function Contact({ onSubmit }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ name, email, message })
    setSent(true)
  }

  return (
    <section id="contact" className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <h2 className="serif" style={{ marginBottom: 16 }}>Booking</h2>
        <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" style={{ padding: 12, border: '1px solid #ddd', background: 'white', transition: 'border-color 200ms ease' }} />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ padding: 12, border: '1px solid #ddd', background: 'white', transition: 'border-color 200ms ease' }} />
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Project details" rows={5} style={{ padding: 12, border: '1px solid #ddd', background: 'white', transition: 'border-color 200ms ease' }} />
          <button className="cta" type="submit">Send</button>
          {sent && <div style={{ letterSpacing: '0.08em' }}>Sent</div>}
        </form>
      </div>
    </section>
  )
}

