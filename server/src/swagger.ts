import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import config from './config';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'API documentation for Task Manager App',
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api`,
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        CreateUserDto: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            }
          }
        },
        LoginUserDto: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              example: 'password123'
            }
          }
        },
        UpdateUserDto: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'newuser@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'newpassword123'
            }
          }
        },
        CreateTaskDto: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              example: 'New Task'
            },
            description: {
              type: 'string',
              example: 'This is a new task'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in progress', 'completed'],
              example: 'pending'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              example: 'medium'
            },
            dueDate: {
              type: 'number',
              description: 'Due date in milliseconds since epoch',
              example: 1672531199000
            },
            category: {
              type: 'string',
              example: 'Work'
            }
          }
        },
        UpdateTaskDto: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              example: 'Updated Task Title'
            },
            description: {
              type: 'string',
              example: 'Updated description'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in progress', 'completed']
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high']
            },
            dueDate: {
              type: 'number',
              description: 'Due date in milliseconds since epoch',
              example: 1672531199000
            },
            category: {
              type: 'string'
            }
          }
        },
        CreateCommentDto: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string',
              example: 'This is a comment.'
            }
          }
        },
        // Schema for a Task (response)
        Task: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              format: 'uuid',
              example: 'a3c1f6b8-8d7e-4a2f-bf7e-df3c9cfd1e8a'
            },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'in progress', 'completed'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            dueDate: { type: 'number', description: 'Milliseconds since epoch' },
            createdBy: { type: 'string', format: 'uuid' },
            category: { type: 'string' },
            comments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  text: { type: 'string' },
                  createdAt: { type: 'number', description: 'Milliseconds since epoch' },
                  userId: { type: 'string', format: 'uuid' }
                }
              }
            },
            createdAt: { type: 'number' },
            updatedAt: { type: 'number' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
};

export default setupSwagger;
