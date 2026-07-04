// Node-сервер для Docker: раздаёт index.html и вызывает ту же функцию api/ask.js, что и Vercel.
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import askHandler from './api/ask.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3000
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' }

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', c => body += c)
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}) } catch (e) { reject(e) }
    })
    req.on('error', reject)
  })
}

function wrapRes(res) {
  res.status = (code) => { res.statusCode = code; return res }
  res.json = (obj) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)) }
  return res
}

http.createServer(async (req, res) => {
  if (req.url.startsWith('/api/ask')) {
    wrapRes(res)
    try {
      req.body = await readBody(req)
    } catch {
      return res.status(400).json({ error: 'invalid json' })
    }
    return askHandler(req, res)
  }

  let p = req.url.split('?')[0]
  if (p === '/') p = '/index.html'
  const file = path.join(__dirname, p)
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found') }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' })
    res.end(data)
  })
}).listen(PORT, () => console.log('Server running on port ' + PORT))
