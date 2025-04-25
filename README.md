# Doctor Listing Page

A modern React application for listing and filtering doctors with various search and filter capabilities.

## Features

- Autocomplete search for doctor names
- Filter by consultation mode (Video Consult/In Clinic)
- Filter by multiple specialties
- Sort by fees (ascending) and experience (descending)
- URL-based state management for filters
- Responsive design
- Modern UI with Material-UI components

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/App.jsx` - Main application component with routing
- `src/pages/DoctorListing.jsx` - Doctor listing page with all features
- `src/index.css` - Global styles
- `src/main.jsx` - Application entry point with theme configuration

## Technologies Used

- React
- Material-UI
- React Router
- Vite

## API

The application fetches doctor data from:
```
https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json
```

## Testing

The application includes data-testid attributes for automated testing:

- `autocomplete-input` - Search input field
- `suggestion-item` - Autocomplete suggestions
- `doctor-card` - Doctor card container
- `doctor-name` - Doctor's name
- `doctor-specialty` - Doctor's specialties
- `doctor-experience` - Doctor's experience
- `doctor-fee` - Doctor's consultation fee
- Various filter-related test IDs for consultation mode, specialties, and sorting

## License

This project is licensed under the MIT License.
