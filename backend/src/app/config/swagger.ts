export const apiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'FileSure Referral & Credit System API (Mongo)',
    version: '1.0.0',
    description: 'Swagger documentation for the referral and credit system (MongoDB).'
  },
  servers: [{ url: 'http://localhost:4000' }],
  paths: {
    '/health': {
      get: { summary: 'Health check', responses: { '200': { description: 'OK' } } }
    },
    '/api/auth/signup': {
      post: {
        summary: 'Sign up a new user (optionally with referral code)',
        requestBody: { required: true, content: { 'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', minLength: 6 },
              name: { type: 'string' },
              referralCode: { type: 'string' }
            },
            required: ['email', 'password', 'name']
          }
        } } },
        responses: { '201': { description: 'Created' }, '400': { description: 'Bad Request' }, '409': { description: 'Conflict' } }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Login and get JWT',
        requestBody: { required: true, content: { 'application/json': {
          schema: { type: 'object', properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 6 } }, required: ['email', 'password'] }
        } } },
        responses: { '200': { description: 'OK' }, '401': { description: 'Unauthorized' } }
      }
    },
    '/api/referrals': {
      get: { summary: 'List your referrals', security: [{ bearerAuth: [] }], responses: { '200': { description: 'OK' }, '401': { description: 'Unauthorized' } } }
    },
    '/api/referrals/link': {
      get: { summary: 'Get your referral code and link', security: [{ bearerAuth: [] }], responses: { '200': { description: 'OK' }, '401': { description: 'Unauthorized' } } }
    },
    '/api/purchases': {
      post: {
        summary: 'Create a simulated purchase; triggers referral credits on first purchase',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { amount: { type: 'number', minimum: 0 } }, required: ['amount'] } } } },
        responses: { '201': { description: 'Created' }, '400': { description: 'Bad Request' }, '401': { description: 'Unauthorized' } }
      }
    },
    '/api/dashboard': {
      get: { summary: 'Get dashboard metrics', security: [{ bearerAuth: [] }], responses: { '200': { description: 'OK' }, '401': { description: 'Unauthorized' } } }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  }
};
