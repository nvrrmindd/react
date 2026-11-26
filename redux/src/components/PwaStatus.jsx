import { useEffect, useState } from 'react'

export default function PwaStatus() {
  const [online, setOnline] = useState(navigator.onLine)
  const [newWorker, setNewWorker] = useState(null)

  useEffect(() => {
    const updateOnline = () => setOnline(navigator.onLine)
    window.addEventListener('online', updateOnline)
    window.addEventListener('offline', updateOnline)

    navigator.serviceWorker?.register(import.meta.env.BASE_URL + 'sw.js').then((registration) => {
      if (registration.waiting) setNewWorker(registration.waiting)
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) setNewWorker(worker)
        })
      })
    })

    return () => {
      window.removeEventListener('online', updateOnline)
      window.removeEventListener('offline', updateOnline)
    }
  }, [])

  function updateApp() {
    navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload())
    newWorker.postMessage('update')
  }

  return (
    <div className="pwa-status">
      {online
        ? <p className="online-indicator">Online</p>
        : <p className="notice offline-notice">Offline — you are viewing saved data</p>}
      {newWorker && (
        <p className="notice update-notice">
          New version available. <button className="btn" onClick={updateApp}>Update</button>
        </p>
      )}
    </div>
  )
}
