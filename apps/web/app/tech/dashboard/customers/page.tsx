import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../../api/auth/[...nextauth]/route'
import { getCustomers } from '../../../../lib/actions/customers'
import CustomersClient from './CustomersClient'

export default async function CustomersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/tech/login')
  }

  // Fetch customers server-side
  let customers = []
  try {
    customers = await getCustomers()
  } catch (error) {
    console.error('Failed to fetch customers:', error)
    // You could render an error UI here instead
  }

  return (
    <CustomersClient initialCustomers={customers} />
  )
}