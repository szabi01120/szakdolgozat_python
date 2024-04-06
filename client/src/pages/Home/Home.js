import React from 'react'
import { UserList, Members, Navbar } from '../../components'
import './Home.css'

export default function Home() {

  return (
    <div>
      <Navbar />
      <Members />
      <UserList />      
    </div>
  )
}
