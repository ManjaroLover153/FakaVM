# FakaVM

A lightweight Node.js-based virtual machine manager with integrated chat, admin controls, and RustDesk web client embedding.

## Features

- Real-time chat powered by Socket.IO
- User list with owner highlight (FakaSys 👑)
- Embedded RustDesk Web Client for VM remote control
- Admin panel with login, user Kick & Ban functionality
- Ban persistence using SQLite3 database
- Simple and clean EJS templating
- Practical LocalStorage-based admin session handling

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/yourusername/fakavm.git
cd fakavm
npm install
```

# Running
```bash
node server.js
```
Open your browser and visit: ``http://localhost:3000``

# Admin Panel
- Visit: http://localhost:3000/admin
- Default admin password: fakasysadmin123
- After login, you can Kick or Ban users.
- Bans are saved persistently in fakavm.db.

# Project Structure
```bash
/public         - Static files (CSS, JS, chat.mp3, etc.)
/views          - EJS templates (index.ejs, admin.ejs, admin-login.ejs)
/server.js      - Main server and Socket.IO logic
/fakavm.db      - SQLite3 database (auto-created)
/.gitignore     - Files to ignore in git
/LICENSE        - MIT License
README.md       - This file
```

# Notes
- This project is a minimal viable product (MVP) for educational and experimental use.
- For production use, consider adding session-based authentication, password encryption, HTTPS, and more robust security.
- The admin panel uses localStorage for session persistence — not secure for public deployments.

# License
This project is licensed under the MIT License — see the LICENSE file for details.




Made with ❤️ by FakaSys, inspired by the spirit of practical, no-nonsense coding.