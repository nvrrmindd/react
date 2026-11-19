import { useEffect, useState } from 'react'

export default function PwaStatus() {
  const [online, setOnline] = useState(navigator.onLine)
  const [updateReady, setUpdateReady] = useState(false)
  const [registration, setRegistration] = useState(null)

  useEffect(() => {
    const updateOnline = () => setOnline(navigator.onLine)
    window.addEventListener('online', updateOnline)
    window.addEventListener('offline', updateOnline)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
        scope: import.meta.env.BASE_URL,
      }).then((serviceWorkerRegistration) => {
        setRegistration(serviceWorkerRegistration)
        setUpdateReady(Boolean(serviceWorkerRegistration.waiting))
        serviceWorkerRegistration.addEventListener('updatefound', () => {
          const worker = serviceWorkerRegistration.installing
          worker?.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateReady(true)
            }
          })
        })
      }).catch((error) => {
        console.error('Service worker registration failed:', error)
      })

      let refreshed = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshed) return
        refreshed = true
        window.location.reload()
      })
    }

    return () => {
      window.removeEventListener('online', updateOnline)
      window.removeEventListener('offline', updateOnline)
    }
  }, [])

  function activateUpdate() {
    registration?.waiting?.postMessage('SKIP_WAITING')
  }

  return (
    <div className="pwa-status" aria-live="polite">
      {!online && (
        <p className="notice offline-notice">
          You are offline. Saved vacancies are available; new account or network actions may need a connection.
        </p>
      )}
      {online && <p className="online-indicator">Online</p>}
      {updateReady && (
        <p className="notice update-notice">
          A new version is ready.{' '}
          <button className="btn" type="button" onClick={activateUpdate}>Update app</button>
        </p>
      )}
    </div>
  )
}
