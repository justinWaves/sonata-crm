'use client'

import { useRouter } from 'next/navigation'
import { AddCustomerModal } from '../../../../../components/AddCustomerModal'
import { createCustomer } from '../../../../../lib/actions/customers'
import { toast } from 'react-hot-toast'
import { useReferralCode } from '../../../../hooks/useReferralCode'

export default function NewCustomerPage() {
  const router = useRouter()
  const generateReferralCode = useReferralCode()

  const handleClose = () => {
    router.push('/tech/dashboard/customers')
  }

  const handleSave = async (customerData: any) => {
    try {
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
        router.push('/tech/dashboard/customers')
      } else {
        toast.error(result.error || 'Failed to add customer')
      }
    } catch (error) {
      toast.error('Failed to add customer')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Add New Customer</h1>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <AddCustomerModal
              isOpen={true}
              onClose={handleClose}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  )
}