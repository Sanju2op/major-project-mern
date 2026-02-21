# Testimonials App
<a href="https://major-project-mern.vercel.app"> Live Project Link</a>

<a href="https://major-project-mern.vercel.app/project-testimonial">Drop a Testimonial for this project thanks</a>

A full-stack MERN + Clerk application for collecting and managing testimonials.

## Structure

- `client/`: Frontend (React)
- `backend/`: Backend (Express, MongoDB)

Project file Structure:

<pre>
my-app/
│
├── client/ # React frontend
│ ├── public/
│ ├── src/
│ │ ├── assets/ # Static files (images, etc.)
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Route-based pages
│ │ ├── services/ # Axios instance, API logic
│ │ ├── context/ # Context API logic (auth, theme, etc.)
│ │ └── App.jsx
│ └── package.json
│
├── server/ # Express backend
│ ├── config/ # DB config, Clerk setup
│ ├── controllers/ # Request logic
│ ├── middleware/ # Auth middleware
│ ├── models/ # Mongoose models
│ ├── routes/ # Route definitions
│ ├── utils/ # Utility functions
│ └── server.js # Entry point
│
├── .env # Environment variables
├── .gitignore
└── README.md
</pre>

