import React from 'react'

export default function Loading() {
    return (
        <div className="flex absolute top-0 left-0 justify-center items-center bg-white/80 z-50 h-full w-full">
        <div className="w-10 h-10 border-4 border-t-fuchsia-800 border-gray-300 rounded-full animate-spin"></div>
      </div>
    )
}
