# 🍿 Binge Hub

![Binge Hub Preview](https://placehold.co/1200x630/FAF8F5/4A3F35?text=Binge+Hub+-+Your+Movie+Database)

Binge Hub is a modern, full-stack React application that serves as the ultimate center for discovering, tracking, and discussing movies and TV shows. Powered by the TMDB API and Firebase, it features a sleek UI with dark mode, real-time community comments, and infinite scrolling.

🌍 **Live Demo:** [https://binge-hub-portfolio.netlify.app](https://binge-hub-portfolio.netlify.app)

## ✨ Key Features

- **Extensive Database:** Fetches data for over 100,000+ movies and TV series using the live TMDB API.
- **User Authentication:** Secure email/password login and registration powered by Google Firebase.
- **Personal Watchlist:** Authenticated users can save their favorite shows and movies to a personal watchlist stored in Firestore.
- **Community Comments:** Real-time commenting system on any movie or TV show detail page.
- **Infinite Scrolling:** Seamlessly load more content as you scroll down the home feed.
- **Dynamic Theming:** Built-in Dark Mode / Light Mode toggle with persistent local storage.
- **Responsive Design:** Fully responsive layout ensuring an optimal viewing experience on desktops, tablets, and mobile devices.
- **Skeleton Loaders:** Premium skeleton loading screens for improved perceived performance.

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router DOM v6
- **Backend & Database:** Firebase Authentication, Cloud Firestore
- **Styling:** Vanilla CSS3 with CSS Variables & Flexbox/Grid
- **Data Source:** The Movie Database (TMDB) API v3
- **Deployment:** Netlify

## 🚀 Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/scoprin/binge-hub-portfolio.git
   cd binge-hub-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a project on [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password) and Firestore Database
   - Add your Firebase config to `src/firebase/config.js`

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is open source and available under the [MIT License](LICENSE).
