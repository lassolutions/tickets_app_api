const express = require('express');
const cors = require('cors');
const app = express();
const postgres  = require('postgres');
const config = require('./conf/config.json');
const sql = postgres(config.DB.url);

app.use(cors());
app.use(express.json());

app.post('/submit-issue', async (req, res) => {
  try {
    const { timestamp, station, issue , location} = req.body;
    await sql`
      INSERT INTO "tickets".issues (timestamp, station, issue, location)
      VALUES (${timestamp}, ${station}, ${issue},${location})
    `;
    res.status(201).send('Issue submitted successfully.');
    console.log("Successful")
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while submitting the issue.');
  }
});

app.get('/issues', async (req, res) => {
  try {


    const issues = await sql`
      SELECT * FROM "tickets".issues
      ORDER BY timestamp DESC


    `;

    res.status(200).json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching issues.');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});