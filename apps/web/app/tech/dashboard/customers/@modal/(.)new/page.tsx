'use client'

import { useRouter } from 'next/navigation'
import { AddCustomerModal } from '../../../../../../components/AddCustomerModal'
import { createCustomer } from '../../../../../../lib/actions/customers'
import { toast } from 'react-hot-toast'
import { useReferralCode } from '../../../../../hooks/useReferralCode'
import SkeletonModal from '../../../../components/SkeletonModal';
import React from 'react'; // Added missing import

export default function NewCustomerModal() {
  const router = useRouter()
  const generateReferralCode = useReferralCode()
  const [loading, setLoading] = React.useState(false); // In case you add async logic

  const handleClose = () => {
    router.back()
  }

  const handleSave = async (customerData: any) => {
    try {
      setLoading(true);
      const referralCode = generateReferralCode()
      const formData = new FormData()
      
      Object.entries({ ...customerData, referralCode }).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value))
        }
      })

      const result = await createCustomer({}, formData)
      
      if (result.success) {
        toast.success('Customer added!')
        router.back()
      } else {
        toast.error(result.error || 'Failed to add customer')
      }
    } catch (error) {
      toast.error('Failed to add customer')
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <SkeletonModal />;
  }

  return (
    <AddCustomerModal
      isOpen={true}
      onClose={handleClose}
      onSave={handleSave}
    />
  )
}