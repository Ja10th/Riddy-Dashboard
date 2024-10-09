'use client';
import React, { useState } from 'react';
import { Autocomplete, useJsApiLoader, Libraries } from '@react-google-maps/api';

// Define the libraries array correctly with the `Library[]` type
const libraries: Libraries = ['places'];

const Form = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [autocompletePickup, setAutocompletePickup] = useState<google.maps.places.Autocomplete | null>(null);
  const [autocompleteDestination, setAutocompleteDestination] = useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBEtw4QhU-44KI_dfLdLpj1YgwpDtPUf54',
    libraries,
  });

  const onLoadPickup = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocompletePickup(autocomplete);
  };

  const onLoadDestination = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocompleteDestination(autocomplete);
  };

  const onPlaceChangedPickup = () => {
    if (autocompletePickup) {
      const place = autocompletePickup.getPlace();
      if (place && place.geometry) {
        setPickup(place.formatted_address || '');
      }
    }
  };

  const onPlaceChangedDestination = () => {
    if (autocompleteDestination) {
      const place = autocompleteDestination.getPlace();
      if (place && place.geometry) {
        setDestination(place.formatted_address || '');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingModalOpen(true);

    if (!pickup || !destination) {
      setIsLoadingModalOpen(false);
      alert("Please fill in both pickup and destination addresses.");
      return;
    }

    // Get coordinates of pickup and destination
    const getCoordinates = async (address: string) => {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyBEtw4QhU-44KI_dfLdLpj1YgwpDtPUf54`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return location;
      }
      return null;
    };

    const pickupLocation = await getCoordinates(pickup);
    const destinationLocation = await getCoordinates(destination);

    if (!pickupLocation || !destinationLocation) {
      setIsLoadingModalOpen(false);
      alert("Invalid address. Please try again.");
      return;
    }

    setTimeout(() => {
      setIsLoadingModalOpen(false);
      window.location.href = `/my-rides?pickupLat=${pickupLocation.lat}&pickupLng=${pickupLocation.lng}&destLat=${destinationLocation.lat}&destLng=${destinationLocation.lng}`;
    }, 2000);
  };

  if (!isLoaded) return <div className='text-4xl text-center py-20'>Loading...</div>;

  return (
    <>
      <div className="py-20 w-full px-10 lg:px-0 dark:bg-white bg-white dark:bg-dot-black/[0.6] bg-dot-black/[0.2] relative flex flex-col-reverse lg:flex-row-reverse gap-4 items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-white bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className='z-50 bg-white  border mt-4 rounded-2xl'>
          <form onSubmit={handleSubmit} className="w-[400px] lg:w-[500px] rounded-lg p-6 mb-6">
            <div>
              <h2 className='text-3xl text-center font-[400] py-8'>Request a ride</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pickup" className="block text-gray-700">Pickup Location</label>
                <Autocomplete onLoad={onLoadPickup} onPlaceChanged={onPlaceChangedPickup}>
                  <input
                    type="text"
                    id="pickup"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    required
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter pickup location"
                  />
                </Autocomplete>
              </div>
              <div>
                <label htmlFor="destination" className="block text-gray-700">Destination</label>
                <Autocomplete onLoad={onLoadDestination} onPlaceChanged={onPlaceChangedDestination}>
                  <input
                    type="text"
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter destination"
                  />
                </Autocomplete>
              </div>
              <div>
                <label htmlFor="date" className="block text-gray-700">Date</label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-gray-700">Time</label>
                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className='flex justify-center mt-8'>
              <button
                type="submit"
                className="bg-indigo-500 text-white py-3 px-2 rounded-xl w-full max-w-[200px]"
              >
                Search Rides
              </button>
            </div>
          </form>
        </div>
        <div className='flex flex-col z-50'>
          <h1 className='text-5xl lg:text-8xl font-[400] max-w-xl text-left mx-auto'>Go <span className='text-indigo-500'>wherever</span>, whenever</h1>
          <p className='max-w-xl py-4 pr-20 pl-3 mx-auto text-left text-gray-500'>Get picked up by a top-rated driver in minutes and enjoy a comfortable ride to wherever you&apos;re going</p>
        </div>
      </div>

      {isLoadingModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl py-10 px-20 w-[400px] text-center">
            <div className="loader rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mx-auto mb-4 animate-spin"></div>
            <p className="text-gray-500 text-lg">Fetching available rides...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Form;
