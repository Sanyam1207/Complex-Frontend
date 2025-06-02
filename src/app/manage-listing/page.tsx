'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ManageLIstingCard from '@/components/ManageListingCard'
import api from '@/lib/axios'

interface Listing {
  _id: string
  location: string
  createdAt: string
  images: string[]
  monthlyPrice: number
}

export default function ManageListingPage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await api.get('/api/rentals/user/mylistings')
        console.log(response)
        setListings(response.data.data || [])
      } catch (error) {
        console.error('Failed to fetch listings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  return (
    <div className="flex flex-col bg-[#1F1F21] min-h-screen">
      {/* Black Header */}
      <div className="flex px-4 items-center py-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-800/50 transition"
        >
          <Image src={'/icons/backbuttonn.svg'} alt="back" height={32} width={32} />
        </button>
        <h1 className="w-full text-center text-sm text-white font-medium">Manage listing</h1>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-white rounded-t-3xl overflow-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {loading && <p className="text-center text-gray-500">Loading listings...</p>}

          {!loading && listings.length === 0 && (
            <p className="text-center text-gray-500">No listings found.</p>
          )}

          {!loading &&
            listings.map((listing) => (
              <ManageLIstingCard
                key={listing._id}
                address={listing.location}
                date={new Date(listing.createdAt)}
                images={listing.images}
                price={listing.monthlyPrice}
                propertyId={listing._id}
                onClick={() => router.push(`/edit-listing/${listing._id}`)}
              />
            ))}
        </div>
      </main>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4">
        <button
          onClick={() => router.push('/create-listing')}
          type="button"
          className="w-full bg-black text-white py-3 rounded-full text-center font-medium hover:opacity-90 transition"
        >
          Create new listing
        </button>
      </div>
    </div>
  )
}
