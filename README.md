# Framez 📸

A modern mobile social media application built with React Native that allows users to capture, share, and discover inspiring visual content. Think Instagram, but built with cutting-edge technology.

## 🌟 Features

### Core Features
- **User Authentication**: Secure sign-up, login, and logout with persistent sessions
- **Create Posts**: Share moments with text captions and/or images
- **Feed**: Browse posts from all users in chronological order
- **User Profile**: View your profile with all your posts and activity

### Bonus Features
- **Comments**: Engage with posts through comments
- **Likes**: Like posts and comments
- **Follow System**: Follow/unfollow other users
- **Edit Profile**: Update your name, username, bio, and avatar
- **Real-time Validation**: Instant username and email availability checking during signup
- **Post Management**: Edit captions and delete your posts
- **User Discovery**: View other users' profiles and their posts
- **Social Stats**: Track followers, following, and post counts

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Backend**: Convex (real-time serverless backend)
- **State Management**: React Context API
- **Authentication**: Convex Auth with password provider
- **Routing**: Expo Router (file-based routing)
- **UI/UX**: Custom components with Instagram-inspired design
- **Image Handling**: Expo Image Picker & Expo Image

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository
```bash
git clone https://github.com/BenedictUmeozor/framez.git
cd framez
```

2. Install dependencies
```bash
npm install
```

3. Set up Convex

First, install Convex CLI globally (if not already installed):
```bash
npm install -g convex
```

Initialize Convex for your project:
```bash
npx convex dev
```

This will:
- Create a new Convex project (or link to existing one)
- Generate a `.env.local` file with your Convex deployment URL
- Start the Convex development server

4. Configure environment variables

Create a `.env.local` file in the root directory with:
```bash
CONVEX_DEPLOYMENT=dev:your-deployment-name
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

These values will be automatically generated when you run `npx convex dev`.

5. Start the development server
```bash
npm start
```

6. Run on your preferred platform
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## 📁 Project Structure

```
framez/
├── app/                    # Expo Router pages
│   ├── index.tsx          # Splash screen
│   ├── login.tsx          # Login screen
│   ├── signup.tsx         # Sign up screen
│   ├── home.tsx           # Main feed
│   ├── profile.tsx        # User profile
│   ├── create-post.tsx    # Create new post
│   ├── edit-profile.tsx   # Edit profile
│   ├── settings.tsx       # Settings
│   └── ...
├── components/            # Reusable components
├── contexts/              # React Context providers
│   └── AuthContext.tsx    # Authentication context
├── convex/                # Convex backend
│   ├── schema.ts          # Database schema
│   ├── auth.ts            # Auth configuration
│   ├── users.ts           # User queries/mutations
│   ├── posts.ts           # Post queries/mutations
│   └── ...
├── hooks/                 # Custom React hooks
└── assets/                # Images, fonts, etc.
```

## 🔧 Backend: Why Convex?

Convex was chosen as the backend for several compelling reasons:

1. **Real-time by Default**: All queries are reactive, providing instant updates across all connected clients
2. **Type Safety**: Full TypeScript support with automatic type generation
3. **Serverless**: No infrastructure management required
4. **Built-in Authentication**: Convex Auth provides secure, production-ready authentication
5. **File Storage**: Native support for image uploads and storage
6. **Developer Experience**: Hot reloading, automatic migrations, and excellent debugging tools
7. **Scalability**: Automatically scales with your application needs

### Convex Features Used

- **Authentication**: Password-based auth with session management
- **Database**: Document-based storage for users, posts, comments, likes, and follows
- **File Storage**: Image uploads for posts and avatars
- **Real-time Queries**: Instant feed updates when new posts are created
- **Mutations**: Secure server-side operations for creating, updating, and deleting data

## 📱 App Screens

1. **Splash Screen**: Initial loading screen with app branding
2. **Login/Signup**: Authentication flows with validation
3. **Home Feed**: Scrollable feed of all posts
4. **Create Post**: Upload images and add captions
5. **Profile**: View your posts and stats
6. **Edit Profile**: Update profile information
7. **Settings**: Logout and app preferences
8. **Post Details**: View individual posts with comments
9. **User Profile**: View other users' profiles
10. **Followers/Following**: View social connections

## 🎨 Design Philosophy

The app follows Instagram's design principles:
- Clean, minimalist interface
- Dark theme for reduced eye strain
- Intuitive navigation
- Smooth animations and transitions
- Focus on visual content

## 🔐 Security

- Passwords are securely hashed using Convex Auth
- All API calls are authenticated
- Users can only modify their own content
- Input validation on both client and server

## 📝 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## 👨‍💻 Author

**Benedict Umeozor**
- GitHub: [@BenedictUmeozor](https://github.com/BenedictUmeozor)
