import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import config from './config';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';
import { authMiddleware } from './middleware/auth.middleware';
import setupSwagger from './swagger';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { scheduleDueDateReminders } from './services/emailReminder';

const app: Application = express();
app.use(express.json());

app.use(cors());

// Connect to MongoDB
mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } as any)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/users', authMiddleware, userRoutes);

// Setup Swagger UI at /api/docs
setupSwagger(app as any);

// Start the scheduled reminder job
scheduleDueDateReminders();

// Setup Apollo Server for GraphQL API
const startApolloServer = async () => {
  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app as any, path: '/graphql' });
};

startApolloServer();

const PORT = config.port;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
