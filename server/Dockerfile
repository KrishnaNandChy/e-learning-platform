FROM node:18-alpine

WORKDIR /app

# Copy package dependencies
COPY package*.json ./

# Install dependencies including dev dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start in development mode (assumes dev script uses nodemon)
CMD ["npm", "run", "dev"]
