import React from 'react'
import { Sidebar } from '../components/Sidebar.jsx'
import { Notes } from './Notes.page.jsx'
import { Links } from './Links.page.jsx'
import { Dashboard } from './Dashboard.page.jsx'

export const Home = () => {
  return (
    <div>
      <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Dashboard/>
        </div>
      </main>
    </div>
    </div>
  )
}
