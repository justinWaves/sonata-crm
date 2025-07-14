'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../app/api/auth/[...nextauth]/route'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export async function getCustomers() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/customers?technicianId=${session.user.id}`, {
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000)
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch customers`)
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching customers:', error)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - API server may be down')
    }
    throw new Error(`Failed to fetch customers: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getCustomer(customerId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  const response = await fetch(`${API_BASE_URL}/customers/${customerId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch customer')
  }
  
  return response.json()
}

export async function createCustomer(prevState: any, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }
    
    const customerData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      companyName: formData.get('companyName') as string || null,
      email: formData.get('email') as string || null,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string || null,
      state: formData.get('state') as string || null,
      zipCode: formData.get('zipCode') as string || null,
      textUpdates: formData.get('textUpdates') === 'on',
      emailUpdates: formData.get('emailUpdates') === 'on',
      referralCode: formData.get('referralCode') as string || null,
      technicianId: session.user.id,
    }

    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error || 'Failed to create customer',
      }
    }

    const newCustomer = await response.json()
    
    revalidatePath('/tech/dashboard/customers')
    
    return {
      success: true,
      customer: newCustomer,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create customer',
    }
  }
}

export async function updateCustomer(prevState: any, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }
    
    const customerData = {
      id: formData.get('id') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      companyName: formData.get('companyName') as string || null,
      email: formData.get('email') as string || null,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string || null,
      state: formData.get('state') as string || null,
      zipCode: formData.get('zipCode') as string || null,
      textUpdates: formData.get('textUpdates') === 'on',
      emailUpdates: formData.get('emailUpdates') === 'on',
      technicianId: session.user.id,
    }

    const response = await fetch(`${API_BASE_URL}/customers/${customerData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error || 'Failed to update customer',
      }
    }

    const updatedCustomer = await response.json()
    
    revalidatePath('/tech/dashboard/customers')
    
    return {
      success: true,
      customer: updatedCustomer,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update customer',
    }
  }
}

export async function deleteCustomer(customerId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }
    
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to delete customer')
    }

    revalidatePath('/tech/dashboard/customers')
    
    return { success: true }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete customer')
  }
}