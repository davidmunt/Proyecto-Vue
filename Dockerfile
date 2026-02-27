FROM node:20-alpine

WORKDIR /app

# Evita problemas de permisos
RUN chown -R node:node /app
USER node

# El comando se define en el docker-compose
CMD ["sh"]