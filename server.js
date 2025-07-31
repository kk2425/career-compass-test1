import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Middleware
app.use(cors()); // Allow requests from our frontend
app.use(express.json({ limit: '10kb' })); // Parse incoming JSON and limit payload size

const DATABASE_FILE = path.join(__dirname, 'database.json');

// API endpoint to receive feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const newFeedback = req.body;

    // Basic validation
    if (!newFeedback.userProfile || !newFeedback.aiRecommendation || !newFeedback.userFeedback) {
      return res.status(400).json({ success: false, message: 'Invalid feedback structure.' });
    }

    // Read the current database file
    let data = [];
    try {
      const fileContent = await fs.readFile(DATABASE_FILE, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (error) {
      // If file doesn't exist or is empty, we start with an empty array.
      if (error.code !== 'ENOENT') throw error;
    }

    // Add the new feedback
    data.push(newFeedback);

    // Write the updated data back to the file
    await fs.writeFile(DATABASE_FILE, JSON.stringify(data, null, 2), 'utf-8');

    console.log(`Successfully saved new feedback to ${DATABASE_FILE}`);
    res.status(200).json({ success: true, message: 'Feedback saved successfully!' });

  } catch (error) {
    console.error('Failed to save feedback:', error);
    res.status(500).json({ success: false, message: 'An internal server error occurred.' });
  }
});

app.listen(port, () => {
  console.log(`✅ Backend server running on http://localhost:${port}`);
  console.log(`   📝 Listening for feedback submissions at /api/feedback`);
});
