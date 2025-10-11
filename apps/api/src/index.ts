import express from 'express';
import cors from 'cors';
import linkRoutes from './routes/link.routes';
import redirectRoutes from './routes/redirect.routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', linkRoutes);

app.use('/', redirectRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});