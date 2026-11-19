import { readFileSync, writeFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = '/react/pwa/dist/'

// Small plugin: after build writes dist/sw.js (with the list of files) and dist/404.html
function serviceWorkerPlugin() {
  return {
    name: 'service-worker',
    writeBundle(options, bundle) {
      const files = Object.keys(bundle) // built index.html, js, css, images
      files.push('manifest.webmanifest', 'offline.html', 'icons/icon-192.png', 'icons/icon-512.png')

      const sw = readFileSync('sw-template.js', 'utf8')
        .replace('__VERSION__', String(Date.now())) // new version on every build
        .replace('__PRECACHE__', JSON.stringify(files))
      writeFileSync(`${options.dir}/sw.js`, sw)

      // GitHub Pages: open index.html for any route (e.g. /jobs/5)
      const index = readFileSync(`${options.dir}/index.html`, 'utf8')
      writeFileSync(`${options.dir}/404.html`, index.replace('<head>', `<head>\n    <base href="${base}" />`))
    },
  }
}

export default defineConfig({
  plugins: [react(), serviceWorkerPlugin()],
  base,
})
