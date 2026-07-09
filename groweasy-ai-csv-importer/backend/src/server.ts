import 'dotenv/config';
import { env } from './config/env';
import createApp from './app';

const app = createApp();

const PORT = parseInt(env.PORT, 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 LeadSense API running on port ${PORT}`);
  console.log(`📊 Environment: ${env.NODE_ENV}`);
});
