import { describe, it, expect } from 'bun:test'
import app from '../server'

describe('GET /check_health', () => {
  it('returns 200 with OK status and a timestamp', async () => {
    const res = await app.request('/check_health')

    expect(res.status).toBe(200)

    const body = (await res.json()) as { status: string; time: number }
    expect(body.status).toBe('OK')
    expect(typeof body.time).toBe('number')
  })
})
