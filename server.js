const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const ADMIN_PASSWORD = 'fakasysadmin123';

const db = new sqlite3.Database('./fakavm.db');
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS bans (
      username TEXT PRIMARY KEY
    )
  `);
});

let users = [];
let bannedUsers = new Set();

function loadBansFromDB() {
  bannedUsers.clear();
  db.all("SELECT username FROM bans", (err, rows) => {
    if (err) {
      console.error("Error loading bans:", err);
      return;
    }
    rows.forEach(row => bannedUsers.add(row.username));
    console.log("Loaded banned users:", [...bannedUsers]);
  });
}

loadBansFromDB();

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/admin', (req, res) => {
  res.render('admin-login');
});

app.post('/admin', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.render('admin', { users });
  } else {
    res.send('<h2>Access Denied</h2><a href="/admin">Try again</a>');
  }
});

app.get('/admin-panel', (req, res) => {
  res.render('admin', { users });
});

app.post('/admin/kick', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send('No username specified');

  for (const [id, socket] of io.sockets.sockets) {
    if (socket.username === username) {
      socket.disconnect(true);
      break;
    }
  }
  res.send('User kicked');
});

app.post('/admin/ban', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send('No username specified');

  db.run("INSERT OR IGNORE INTO bans (username) VALUES (?)", [username], (err) => {
    if (err) {
      console.error('Failed to insert ban:', err);
      return res.status(500).send('Database error');
    }

    bannedUsers.add(username);

    for (const [id, socket] of io.sockets.sockets) {
      if (socket.username === username) {
        socket.disconnect(true);
        break;
      }
    }
    res.send('User banned');
  });
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('new user', (username) => {
    if (bannedUsers.has(username)) {
      socket.emit('banned');
      socket.disconnect(true);
      return;
    }
    socket.username = username;
    users.push(username);
    io.emit('update users', users);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      users = users.filter(user => user !== socket.username);
      io.emit('update users', users);
    }
  });
});

http.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
