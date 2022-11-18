import * as dotenv from 'dotenv';
const PORT = process.env.PORT || 3009;
import app from './app';

dotenv.config();

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
