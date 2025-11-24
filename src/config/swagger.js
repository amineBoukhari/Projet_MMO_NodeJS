import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const swaggerDocument = YAML.load(path.resolve('./swagger.yaml'));

export default {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  }),
};