import { requireUser } from '@/lib/dal'
import { AppShellClient } from '@/components/AppShellClient'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireUser()

  return <AppShellClient user={user}>{children}</AppShellClient>
}
