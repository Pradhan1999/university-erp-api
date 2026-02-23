
import express, { Request, Response } from 'express';

const app = express();
const PORT = 8000;

// Middleware to parse JSON
app.use(express.json());

// Root GET route
app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'University ERP API is running!' });
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
