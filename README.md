# Civic Cast

Civic Cast is a modern, full-stack web application for managing and participating in online elections. It provides a secure, user-friendly platform for admins to create elections, register candidates and voters, and for users to cast votes in real time.

## Features

- **Admin Dashboard**: Manage elections, candidates, and voters with real-time stats and activity feeds.
- **Election Management**: Create elections, define posts, and assign candidates.
- **Candidate & Voter Registration**: Register candidates (with profile pictures) and voters securely.
- **Voting System**: Authenticated users can vote in ongoing elections; voting is tracked and restricted per post.
- **Results & Analytics**: View live results, vote distributions, and recent activity.
- **Authentication**: Secure sign-up, sign-in, and sign-out flows for admins and voters.
- **Modern UI/UX**: Responsive, accessible, and visually appealing interface with animations.

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, MongoDB (Mongoose ODM)
- **Authentication**: NextAuth.js
- **File Uploads**: Cloudinary (for candidate profile pictures)
- **State Management**: React Context, useState, useEffect
- **UI Components**: Lucide Icons, shadcn, custom components
- **Animation & Visuals**: GSAP (GreenSock Animation Platform) for advanced UI animations, Three.js for 3D and visual effects

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/gottatouchsomegrass/civic_cast.git
   cd civic_cast
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

### Running Locally
```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
npm start
```

## Deployment
- Deploy easily to [Vercel](https://vercel.com/) or any platform supporting Next.js.
- Set the same environment variables in your deployment dashboard.

## Folder Structure
```
civic_cast/
├── src/
│   ├── app/                # Next.js app directory (routes, pages, API)
│   ├── components/         # Reusable UI components
│   ├── context/            # React context providers
│   ├── lib/                # Utility libraries (db, auth, etc.)
│   ├── model/              # Mongoose models
│   ├── schema/             # Validation schemas
│   ├── types/              # TypeScript types
│   └── ...
├── public/                 # Static assets
├── package.json
├── next.config.ts
├── README.md
└── ...
```

## Contributing
1. Fork the repo and create your branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m 'Add some feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a pull request

## License
This project is licensed under the MIT License.

---

**Civic Cast** — Empowering transparent and secure digital elections.
