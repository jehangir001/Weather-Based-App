# Weather & Outfit App 🌤️

A modern weather application built with Next.js and Ionic that provides weather information and outfit suggestions for cities around the world.

## Features

- 🌍 **City Search**: Search for any city with autocomplete suggestions
- 🌡️ **Weather Data**: Temperature, humidity, wind speed, and weather conditions
- 👕 **Outfit Suggestions**: Smart recommendations based on weather conditions
- 🌙 **Dark/Light Theme**: Toggle between themes with smooth transitions
- 📱 **Mobile-First**: Responsive design optimized for mobile devices
- ⚡ **Real-time Data**: Live weather data from OpenWeatherMap API
- 📚 **Search History**: Keep track of recently searched cities

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: Ionic React v8
- **Styling**: SCSS with Ionic CSS variables
- **State Management**: React Context API
- **API**: OpenWeatherMap Weather API
- **Icons**: Ionicons
- **TypeScript**: Full type safety

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Weather-Based-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up API Key**
   - Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Replace the API key in `src/shared/DataContext.tsx`:
   ```typescript
   const OPENWEATHER_API_KEY = "your-api-key-here";
   ```

## Running the App

### Development Mode

```bash
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:4100](http://localhost:4100)

### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.scss       # Global styles and Ionic imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── AppWrapper.tsx     # Client-side app wrapper
│   ├── Header.tsx         # App header with theme toggle
│   ├── Main.tsx           # Main content area
│   └── Footer.tsx         # App footer
├── shared/                # Shared utilities
│   └── DataContext.tsx    # Weather context and API logic
└── assets/                # Static assets
    └── css/               # Additional stylesheets
```

## Development Decisions

### Architecture Choices

1. **Client-Side Only Rendering**
   - Used dynamic imports with `ssr: false` to prevent hydration mismatches
   - All Ionic components load only on the client side
   - Ensures consistent rendering across server and client

2. **Component Structure**
   - Separated concerns: Header, Main, Footer components
   - Shared DataContext for state management
   - Modular component architecture for maintainability

3. **Styling Approach**
   - Ionic CSS variables for theme support
   - SCSS for custom styling
   - Responsive design with Ionic's grid system

4. **API Integration**
   - OpenWeatherMap API for real-time weather data
   - Error handling for API failures
   - Mock suggestions for city search

### Key Features Implementation

1. **Theme System**
   - CSS variables for light/dark themes
   - Automatic theme switching with smooth transitions
   - Browser theme color updates

2. **Search Functionality**
   - Debounced search input (300ms delay)
   - Autocomplete suggestions
   - Search history management

3. **Weather Display**
   - Grid layout for weather information
   - Dynamic icons based on weather conditions
   - Outfit suggestions based on temperature and conditions

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your-api-key-here
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [Ionic](https://ionicframework.com/) for UI components
- [Next.js](https://nextjs.org/) for the framework
