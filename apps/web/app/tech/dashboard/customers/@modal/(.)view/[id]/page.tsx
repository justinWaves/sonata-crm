'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, use } from 'react'
import { toast } from 'react-hot-toast'
import CustomerCardModal from '../../../../../../../components/CustomerCardModal'
import { getCustomer } from '../../../../../../../lib/actions/customers'
import type { Customer } from '../../../../../../../types/customer'
import SkeletonModal from '../../../../../../../components/SkeletonModal';

interface ViewCustomerModalProps {
  params: Promise<{
    id: string
  }>
}

export default function ViewCustomerModal({ params }: ViewCustomerModalProps) {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const resolvedParams = use(params)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customerData = await getCustomer(resolvedParams.id)
        setCustomer(customerData)
      } catch (error) {
        toast.error('Customer not found')
        router.back()
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [resolvedParams.id, router])

  const handleClose = () => {
    router.back()
  }

  const handleEdit = (customer: Customer) => {
    router.push(`/tech/dashboard/customers/edit/${customer.id}`)
  }

  if (loading || !customer) {
    return <SkeletonModal />;
  }

  return (
    <CustomerCardModal
      customer={customer}
      onClose={handleClose}
      onEdit={handleEdit}
    />
  )
}