import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../../../api/auth/[...nextauth]/route'
import NewCustomerPage from './NewCustomerPage'

export default async function NewCustomerFallback() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/tech/login')
  }

  return <NewCustomerPage />
}