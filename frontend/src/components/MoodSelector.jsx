import React from 'react'

const moods = [
  { name: 'All', color: 'bg-gray-500' }, // Added "All" to reset the filter
  { name: 'Chill', color: 'bg-green-500' },
  { name: 'Hype', color: 'bg-red-500' },
  { name: 'Focus', color: 'bg-purple-500' },
  { name: 'Happy', color: 'bg-yellow-500' },
  { name: 'Sad', color: 'bg-blue-500' }
]

// We add "onSelectMood" as a prop here
const MoodSelector = ({ onSelectMood }) => {
  return (
    <div className="my-10 text-center">
      <h2 className="text-2xl font-semibold mb-6">How are you feeling, Kanav?</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => onSelectMood(mood.name)} // This sends the choice back to App.jsx
            className={`${mood.color} hover:scale-110 active:scale-95 transform transition-all duration-200 px-8 py-3 rounded-xl font-bold text-gray-900 shadow-lg`}
          >
            {mood.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MoodSelector