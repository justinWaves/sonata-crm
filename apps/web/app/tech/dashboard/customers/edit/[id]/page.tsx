import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../../../../api/auth/[...nextauth]/route'
import EditCustomerPage from './EditCustomerPage'

interface EditCustomerFallbackProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCustomerFallback({ params }: EditCustomerFallbackProps) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/tech/login')
  }

  const resolvedParams = await params
  return <EditCustomerPage customerId={resolvedParams.id} />
}