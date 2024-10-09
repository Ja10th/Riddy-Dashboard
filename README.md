# My Rides Dashboard

This project is a ride-booking dashboard that allows users to select pickup and destination locations, choose from available rides, and calculate estimated travel routes using Google Maps. The app integrates dynamic location search, route calculation, and pricing for various vehicle types.

[Live Project](https://riddydashboard.vercel.app/)

## Features

- **Location Autocomplete**: Utilizes Google Places API to allow users to search for and select pickup and destination locations.
- **Dynamic Route Calculation**: Uses Google Maps Directions API to calculate the best driving route between selected pickup and destination points.
- **Ride Selection**: Users can choose from different vehicle options (Sedan, SUV, Hatchback), each with different pricing.
- **Previous Bookings**: Displays a list of past bookings, including details like vehicle type, trip price, and user ratings.
- **Modals**: Modals for booking confirmation and success messages after a ride is selected.
- **Responsive Design**: The UI is fully responsive, adapting to different screen sizes.

## Tech Stack

- **React**: The core UI framework for building the dashboard.
- **Next.js**: Used to structure the project and manage routing.
- **TypeScript**: Ensures type safety throughout the project, enhancing development efficiency and preventing runtime errors.
- **Google Maps API**: 
  - **Places Autocomplete**: For dynamic address suggestions.
  - **Directions Service**: To calculate and render routes between locations.
  - **Geocoding**: To fetch the address from the latitude and longitude of a location.
- **React Icons**: For icons, such as car images and chevron arrows.
- **Local Storage**: Saves user ride data for future use when the page is refreshed.
- **React Hooks**: To manage component state and side effects (e.g., API calls).
- **CSS**: To style the dashboard and ensure a clean, responsive layout.
  
## Key Integrations

1. **Google Places Autocomplete API**: Provides search suggestions for locations and returns the latitude and longitude of the selected place.
2. **Google Maps Directions API**: Takes the coordinates of pickup and destination points and calculates the route between them.
3. **Geocoding API**: Converts coordinates (latitude, longitude) to human-readable addresses.

## Usage

To use this project, clone the repository and install the dependencies:

```bash
git clone https://github.com/your-repo/my-rides-dashboard.git

cd my-rides-dashboard

npm install

npm run dev
