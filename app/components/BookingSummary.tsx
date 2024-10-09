import React from 'react';

interface BookingSummaryProps {
  pickup: string;
  destination: string;
  date: string;
  time: string;
  selectedRide: { name: string; price: string } | null;
  onEdit: () => void;
  onCancel: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  pickup,
  destination,
  date,
  time,
  selectedRide,
  onEdit,
  onCancel,
}) => {
  return (
    <div className='flex justify-center items-center py-20 max-w-7xl mx-auto'>
    <div className="bg-white rounded-xl w-[500px] py-14 px-8 mt-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
      <p><strong>Pickup Location:</strong> {pickup}</p>
      <p><strong>Destination:</strong> {destination}</p>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Time:</strong> {time}</p>
      {selectedRide && (
        <>
          <p><strong>Selected Ride:</strong> {selectedRide.name}</p>
          <p><strong>Price:</strong> {selectedRide.price}</p>
        </>
      )}
      <div className="flex justify-between mt-4">
        <button
          className="bg-indigo-500 text-white py-1 px-3 rounded hover:bg-indigo-600 transition duration-150"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-150"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
    </div>
  );
};

export default BookingSummary;
