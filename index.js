const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Dummy AI tagging endpoint
app.post('/api/analyze', (req, res) => {
  const tags = ['speech', 'music', 'noise', 'silence'];
  const selected = tags[Math.floor(Math.random() * tags.length)];
  res.json({ tag: selected });
});

app.get('/', (req, res) => {
  res.send('HearDiary AI Backend is running');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});