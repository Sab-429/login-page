import { RateLimit } from '@/src/model/RateLimit.model'
import dbConnect from '@/src/lib/mongoodb'

const WINDOW_MS = 10 * 60 * 1000 
const MAX_REQUESTS = 7

export async function rateLimit(ip: string) {
  await dbConnect()

  const now = new Date()

  const record = await RateLimit.findOne({ ip })

  if (!record) {
    await RateLimit.create({
      ip,
      count: 1,
      lastRequest: now,
    })
    return { allowed: true }
  }

  const timeDiff =
    now.getTime() - record.lastRequest.getTime()

  if (timeDiff > WINDOW_MS) {
    record.count = 1
    record.lastRequest = now
    await record.save()
    return { allowed: true }
  }

  if (record.count >= MAX_REQUESTS) {
    return { allowed: false }
  }

  record.count += 1
  record.lastRequest = now
  await record.save()

  return { allowed: true }
}
