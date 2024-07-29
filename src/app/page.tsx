import { permanentRedirect } from 'next/navigation'

export default function Home() {
  permanentRedirect('/cryptarithm')
  return null
}
