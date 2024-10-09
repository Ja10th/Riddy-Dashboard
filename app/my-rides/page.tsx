'use client';
import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import { FaCar, FaChevronDown } from 'react-icons/fa';
import SuccessModal from '../components/Modal';

interface Ride {
  vehicle: string;
  price: number;
}

const MyRidesPage: React.FC = () => {
  const availableRides: Ride[] = [
    { vehicle: 'Sedan', price: 5000 },
    { vehicle: 'SUV', price: 8000 },
    { vehicle: 'Hatchback', price: 3000 },
  ];

  const [rideData, setRideData] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
  });

  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  const [selectedRide, setSelectedRide] = useState<Ride>(availableRides[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [pickupRef, setPickupRef] = useState<google.maps.places.Autocomplete | null>(null);
  const [destinationRef, setDestinationRef] = useState<google.maps.places.Autocomplete | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{ pickup: string; destination: string; date: string; time: string; price: number; } | null>(null);

  // Function to fetch address from coordinates
  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`);
    const data = await response.json();
    return data.results[0]?.formatted_address || '';
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pickupLat = params.get('pickupLat');
    const pickupLng = params.get('pickupLng');
    const destLat = params.get('destLat');
    const destLng = params.get('destLng');

    if (pickupLat && pickupLng) {
      const lat = parseFloat(pickupLat);
      const lng = parseFloat(pickupLng);
      setPickupCoords({ lat, lng });
    }

    if (destLat && destLng) {
      const lat = parseFloat(destLat);
      const lng = parseFloat(destLng);
      setDestinationCoords({ lat, lng });
      fetchAddressFromCoords(lat, lng).then((address) => {
        setRideData((prev) => ({ ...prev, destination: address }));
      });
    }
  }, []);

  useEffect(() => {
    if (pickupCoords && destinationCoords) {
      calculateRoute(); // Call calculateRoute whenever coords change
    }
  }, [pickupCoords, destinationCoords]);

  const handleRideSelection = (ride: Ride) => {
    setSelectedRide(ride);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRideData({ ...rideData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(false);
    calculateRoute();
  };

  const calculateRoute = () => {
    if (!pickupCoords || !destinationCoords) return; // Ensure both coordinates are available
    
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: pickupCoords,
        destination: destinationCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          if (mapRef) {
            mapRef.panTo(result.routes[0].legs[0].start_location);
          }
        } else {
          console.error('Error fetching directions', status);
          setDirections(null);
        }
      }
    );
  };

  const handleSelectCar = () => {
    setBookingDetails({
      pickup: rideData.pickup,
      destination: rideData.destination,
      date: rideData.date,
      time: rideData.time,
      price: selectedRide.price,
    });
    setShowModal(true);
  };

  const previousBookings = [
    { id: 1, pickup: 'Ondo', destination: 'Benin', vehicle: 'SUV', price: 18000, rating: 5 },
    { id: 2, pickup: 'Akure', destination: 'Lagos', vehicle: 'Sedan', price: 9000, rating: 4 },
    { id: 3, pickup: 'Ikeja', destination: 'Ibadan', vehicle: 'Hatchback', price: 3000, rating: 5 },
    { id: 4, pickup: 'Mainland', destination: 'Agege', vehicle: 'SUV', price: 8000, rating: 4 },
    { id: 5, pickup: 'Onitsha', destination: 'Abia', vehicle: 'Sedan', price: 9000, rating: 5 },
  ];

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  if (!apiKey) {
    return <div>Error: Google Maps API key is missing.</div>; // Handle missing API key gracefully
  }

  return (
    <div>
      <NavBar />
     <div className="flex flex-col lg:flex-row justify-between max-w-6xl mx-auto mt-10">
          
          {/* Ride Summary */}
          <div className="flex-1 p-6 border h-[40vh] border-gray-300 rounded-xl">
            <h2 className="text-2xl font-bold pb-6">Get a ride</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
              <label className="block">
                <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
                  <Autocomplete
                    onLoad={(ref) => setPickupRef(ref)}
                    onPlaceChanged={() => {
                      if (pickupRef) {
                        const place = pickupRef.getPlace();
                        if (place.geometry && place.geometry.location) {
                          const { lat, lng } = place.geometry.location.toJSON();
                          // Set the formatted address directly
                          setRideData((prev) => ({
                            ...prev,
                            pickup: place.formatted_address || '', // Ensure pickup is set to the formatted address
                          }));
                          setPickupCoords({ lat, lng });
                          calculateRoute(); // Calculate the route if destination is set
                        }
                      }
                    }}
                  >
                    <input
                      type="text"
                      name="pickup"
                      value={rideData.pickup}
                      onChange={handleChange}
                      className="w-full my-2 p-2 border bg-gray-200 border-gray-300 rounded-lg"
                      placeholder="Enter pickup location"
                    />
                  </Autocomplete>

                  <Autocomplete
                  onLoad={(ref) => setDestinationRef(ref)}
                  onPlaceChanged={() => {
                    if (destinationRef) {
                      const place = destinationRef.getPlace();
                      if (place.geometry && place.geometry.location) {
                        const { lat, lng } = place.geometry.location.toJSON();
                        // Set the formatted address directly
                        setRideData((prev) => ({
                          ...prev,
                          destination: place.formatted_address || '', // Ensure destination is set to the formatted address
                        }));
                        setDestinationCoords({ lat, lng });
                        calculateRoute(); // Calculate the route if pickup is set
                        }
                      }
                    }}
                  >
                    <input
                      type="text"
                      name="destination"
                      value={rideData.destination}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border bg-gray-200 border-gray-300 rounded-lg"
                      placeholder="Enter destination location"
                    />
                  </Autocomplete>
                </LoadScript>
              </label>
              <label className="block">
                <input
                  type="date"
                  name="date"
                  value={rideData.date}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border bg-gray-200 border-gray-300 rounded-lg"
                />
              </label>
              <label className="block">
                <input
                  type="time"
                  name="time"
                  value={rideData.time}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border bg-gray-200 border-gray-300 rounded-lg"
                />
              </label>
              {isEditing && (
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-lg mt-2"
                >
                  Submit
                </button>
              )}
            </form>
          </div>

          {/* Available Rides */}
          <div className="flex-1 p-4 rounded-lg mx-4">
            <h2 className="text-4xl font-black">Choose a ride</h2>
            <p className='text-gray-500 pb-6 pt-3'>Recommended</p>
            <ul>
              {availableRides.map((ride, index) => (
                <li
                  key={index}
                  className={`flex items-center justify-between border-b py-6 px-10 cursor-pointer ${
                    selectedRide.vehicle === ride.vehicle ? 'border bg-blue-100 border-black rounded-xl font-bold' : ''
                  }`}
                  onClick={() => handleRideSelection(ride)}
                >
                  <div className="flex items-center">
                    <FaCar className="h-8 w-8 mr-2" />
                    <span>{ride.vehicle}</span>
                  </div>
                  <span className='font-bold text-sm'>NGN <span className='text-xl'>{ride.price}</span> </span>
                </li>
              ))}
            </ul>
            <div className='mt-40 flex items-center gap-6'>
              <p className='flex items-center gap-1'>Select Payment <FaChevronDown /></p>
            <button
              className=" bg-indigo-500 text-white py-2 px-6 rounded-xl  "
              onClick={handleSelectCar}
            >
              Select {selectedRide?.vehicle}
            </button>
            </div>
            
          </div>
          <div className="flex-1 p-4 h-[30vh] lg:h-[80vh] w-full rounded-2xl">
            <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
            <GoogleMap
              onLoad={setMapRef}
              center={pickupCoords ? pickupCoords : { lat: 9.082, lng: 8.6753 }}
              zoom={14}
              mapContainerStyle={{ height: '100%', width: '100%' }}
              >
              {pickupCoords && <Marker position={pickupCoords} />}
              {destinationCoords && <Marker position={destinationCoords} />}
              {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            </LoadScript>
          </div>
          <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          ride={selectedRide}
          bookingDetails={bookingDetails}
          onConfirm={() => {
            setShowSuccessModal(true); // Show success modal on confirm
            setShowModal(false); // Close booking confirmation modal
          }}
        />

          <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)} // Close success modal
          />
        </div>
        <div className='flex flex-col lg:flex-row max-w-7xl mx-auto py-20'>
          <div>
          {bookingDetails && (
          <div className=' px-10'>
          <div className="p-10 border max-w-md my-20  border-gray-300 rounded-xl">
          <h3 className="text-2xl py-4 font-[400]">Booking Summary</h3>
          <p><strong>Pickup:</strong> {bookingDetails.pickup}</p>
          <p><strong>Destination:</strong> {bookingDetails.destination}</p>
          <p><strong>Date:</strong> {bookingDetails.date}</p>
          <p><strong>Time:</strong> {bookingDetails.time}</p>
          <p><strong>Car:</strong> {selectedRide.vehicle}</p>
          <p><strong>Price:</strong> NGN {selectedRide.price}</p>
        </div>
          </div>
       
      )}
          </div>
        
      <div className='max-w-4xl hidden lg:block lg:max-w-7xl px-20 mx-auto lg:px-10'>
      <div className="my-10 max-w-md lg:max-w-6xl  p-10 border border-gray-300 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Previous Bookings</h2>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className=" text-white">
              <th className="p-4 border-b text-black font-semibold ">Vehicle</th>
              <th className="p-4 border-b text-black font-semibold">Pickup</th>
              <th className="p-4 border-b text-black font-semibold ">Destination</th>
              <th className="p-4 border-b text-black font-semibold">Price</th>
              <th className="p-4 border-b text-black font-semibold">Rating</th>
            </tr>
          </thead>
          <tbody>
            {previousBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-100 text-center">
                <td className="p-4 border-b">{booking.vehicle}</td>
                <td className="p-4 border-b">{booking.pickup}</td>
                <td className="p-4 border-b">{booking.destination}</td>
                <td className="p-4 border-b">₦{booking.price}</td>
                <td className="p-4 border-b">{booking.rating} ★</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
        </div>
        
        
      </div>
    );
  };

  export default MyRidesPage;



 // Update Modal component to handle confirm action
const Modal = ({ isOpen, onClose, ride, bookingDetails, onConfirm }: { isOpen: boolean; onClose: () => void; ride: Ride; bookingDetails: { pickup: string; destination: string; date: string; time: string; price: number; } | null; onConfirm: () => void; }) => {
  if (!isOpen || !bookingDetails) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white py-12 px-20 rounded-xl shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">Confirm Your Booking</h2>
        <div className="space-y-2">
          <p><strong>Pickup:</strong> {bookingDetails.pickup}</p>
          <p><strong>Destination:</strong> {bookingDetails.destination}</p>
          <p><strong>Date:</strong> {bookingDetails.date}</p>
          <p><strong>Time:</strong> {bookingDetails.time}</p>
          <p><strong>Car:</strong> {ride.vehicle}</p>
          <p className="text-lg font-bold text-blue-600"><strong>Price:</strong> NGN {ride.price}</p>
        </div>
        <div className="flex justify-between mt-6">
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200" onClick={onConfirm}> {/* Trigger success modal */}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
  