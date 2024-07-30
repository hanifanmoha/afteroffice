import { NextResponse } from 'next/server'
import { PROBLEM_SET } from './problemSet'

export async function GET() {
  const len = PROBLEM_SET.length

  const rand = Math.floor(Math.random() * len)

  const problem = PROBLEM_SET[rand]

  return NextResponse.json({ problem: problem })
}
