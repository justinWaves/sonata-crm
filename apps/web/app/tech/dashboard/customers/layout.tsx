import { ReactNode } from 'react'

interface CustomersLayoutProps {
  children: ReactNode
  modal: ReactNode
}

export default function CustomersLayout({ children, modal }: CustomersLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}