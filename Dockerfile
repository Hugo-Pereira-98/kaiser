FROM node:16

WORKDIR /app

# Install dependencies
COPY ./package.json yarn.lock ./

RUN yarn

# Copy other files
COPY ./ ./

# Generate Prisma Client
RUN yarn prisma generate

# Default command
CMD ["sh", "-c", "sleep 10 && yarn start:dev"]