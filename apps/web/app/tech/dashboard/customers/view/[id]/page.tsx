import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../../../../api/auth/[...nextauth]/route'
import ViewCustomerPage from './ViewCustomerPage'

interface ViewCustomerFallbackProps {
  params: Promise<{
    id: string
  }>
}

export default async function ViewCustomerFallback({ params }: ViewCustomerFallbackProps) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/tech/login')
  }

  const resolvedParams = await params
  return <ViewCustomerPage customerId={resolvedParams.id} />
}