import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dal'

export default async function HomePage() {
  const user = await getCurrentUser()
  redirect(user ? '/tickets' : '/login')
}
