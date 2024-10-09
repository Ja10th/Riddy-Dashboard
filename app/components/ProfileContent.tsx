import React, { useState, useEffect } from 'react';

const ProfileContent = () => {
  // State to hold user information
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(true); // State to manage form visibility

  // Load user information from localStorage when the component mounts
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const { name, email, location } = JSON.parse(savedProfile);
      setName(name);
      setEmail(email);
      setLocation(location);
      setIsEditing(false); // Set to false if profile data is found
    }
  }, []);

  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'location') setLocation(value);
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userProfile = { name, email, location };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    alert('Profile updated successfully!');
    setIsEditing(false); // Hide the form after submission
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Profile Header */}
      <div className="flex items-center mb-4">
        <img
          src="https://via.placeholder.com/100" // Replace with user profile picture URL
          alt="Profile"
          className="w-24 h-24 rounded-full border-2 border-indigo-500"
        />
        <div className="ml-4">
          <h2 className="text-2xl font-semibold text-gray-800">{name || 'John Doe'}</h2>
          <p className="text-gray-600">{email || 'johndoe@example.com'}</p>
        </div>
      </div>

      {/* Conditional Rendering of the Profile Form */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleInputChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={location}
              onChange={handleInputChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your location"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Save Profile
          </button>
        </form>
      ) : (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
          <p className="text-gray-600"><strong>Name:</strong> {name}</p>
          <p className="text-gray-600"><strong>Email:</strong> {email}</p>
          <p className="text-gray-600"><strong>Location:</strong> {location}</p>
          <button
            onClick={() => setIsEditing(true)} // Allow user to edit profile again
            className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileContent;
