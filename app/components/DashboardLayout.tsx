import React from 'react'
import NavBar from './NavBar'
import Form from './Form'

const DashboardLayout = () => {
  return (
    <>
        <NavBar />
        <hr className='mt-4'/>
        <Form />
    </>
  )
}

export default DashboardLayout