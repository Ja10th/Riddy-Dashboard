// components/SuccessModal.tsx
import React from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white py-12 px-20 rounded-xl shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">Booking Successful</h2>
        <p className="text-center">Your ride has been booked successfully!</p>
        <div className="flex justify-center mt-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
