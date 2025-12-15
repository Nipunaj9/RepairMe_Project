# RepairME - Emergency Vehicle Repair Service

A location-based web application that connects stranded drivers with nearby garages, enabling real-time repair requests and navigation support.

## Features

### Driver Features
- Login/Register
- GPS location detection
- View nearby garages on map
- Send repair requests
- Track garage personnel in real-time
- See estimated arrival time

### Garage Features
- Login/Register
- Receive repair requests
- Accept/reject requests
- View driver's live location
- Get navigation route
- Update job status

## Tech Stack

- **Frontend**: React.js with Vite
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)
- **Maps**: Google Maps API
- **Styling**: CSS3 with modern UI/UX

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Configure Firebase:**
   - See [SETUP.md](./SETUP.md) for detailed instructions
   - Create Firebase project and enable Authentication & Firestore
   - Update `src/config/firebase.js` with your config

3. **Configure Google Maps:**
   - Get API key from Google Cloud Console
   - Update `src/config/maps.js` with your API key

4. **Run the development server:**
```bash
npm run dev
```

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## Firebase Configuration

You need to set up:
- Authentication (Email/Password)
- Firestore Database
- Google Maps API key

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── config/        # Firebase and API configs
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
└── styles/        # Global styles
```

