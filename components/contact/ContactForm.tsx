'use client'

import { useState } from 'react'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    
    // Fallback form handling, normally we'd hit a server action or API route.
    // Given the task, we just simulate a successful submission.
    setTimeout(() => {
      setStatus('success')
      ;(e.target as HTMLFormElement).reset()
    }, 1000)
  }

  if (status === 'success') {
    return (
      <div className="card-base p-8 text-center bg-green-50/50">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          ✓
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent Successfully!</h3>
        <p className="text-green-700 mb-6">
          Thank you for reaching out. Our team will get back to you shortly.
        </p>
        <button onClick={() => setStatus('idle')} className="btn btn-primary">
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card-base p-6 md:p-8">
      <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-navy-900)' }}>Send us a Message</h3>
      
      {status === 'error' && (
        <div className="mb-6 p-4 rounded-md bg-red-50 text-red-600 text-sm">
          {errorMessage || 'Something went wrong. Please try again.'}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-navy-900)' }}>
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-2.5 rounded-md border border-neutral-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-navy-900)' }}>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-2.5 rounded-md border border-neutral-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="john@company.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-navy-900)' }}>
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full px-4 py-2.5 rounded-md border border-neutral-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="+91 98765 43210"
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-navy-900)' }}>
            Company Name
          </label>
          <input
            type="text"
            id="company"
            name="company"
            className="w-full px-4 py-2.5 rounded-md border border-neutral-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Your Company Pvt Ltd"
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-navy-900)' }}>
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full px-4 py-2.5 rounded-md border border-neutral-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-y"
          placeholder="How can we help you?"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className={`w-full btn btn-primary flex justify-center py-3 text-base ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
