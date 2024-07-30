import React from 'react'
import { Navbar } from '../../components'

export default function NotFound({user}){
  return (
    <div>
        <Navbar user={user}/>
        <h1>404 - Not Found!</h1>
    </div>
  )
}