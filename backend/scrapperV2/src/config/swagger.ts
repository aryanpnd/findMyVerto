import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'UMS API',
            version: '1.0.0',
            description: 'API documentation for UMS API',
        },
        tags: [
            {
                name: 'Auth',
                description: 'Authentication endpoints'
            },
            {
                name: 'Student',
                description: 'Student information endpoints'
            },
            {
                name: 'Friends',
                description: 'Friend management endpoints'
            }
        ],
        components: {
            schemas: {
                LoginRequest: {
                    type: 'object',
                    properties: {
                        reg_no: {
                            type: 'string',
                            description: 'Student registration number'
                        },
                        password: {
                            type: 'string',
                            description: 'Student password'
                        }
                    },
                    required: ['reg_no', 'password']
                }
            }
        }
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};