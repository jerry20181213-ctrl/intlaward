import { NextResponse } from 'next/server'
import { awards } from '@/lib/data/awards'

export async function GET() {
  // Return lightweight list (omit detailed judging criteria for listing)
  const summary = awards.map(a => ({
    id: a.id,
    name: a.name,
    nameCn: a.nameCn,
    slug: a.slug,
    categories: a.categories,
    fee: a.fee.professional,
    difficulty: a.difficulty,
    winRate: a.winRate,
    deadline: a.deadlines.regular,
  }))

  return NextResponse.json({ awards: summary, total: awards.length })
}
