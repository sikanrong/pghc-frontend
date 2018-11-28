const express = require("express");
const path = require('path');
const app = express();

// static file serve
app.use(express.static(path.join(__dirname, 'app')));
// not found in static files, so default to index.html
app.use((req, res) => res.sendFile(path.join(__dirname, 'app', 'index.html')));
app.listen(3000);