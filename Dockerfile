# Specify a base image
FROM node:16-alpine

# Setup working directory
WORKDIR /app

# Set environment variables


# Copy package.json to working directory
COPY package*.json ./

# Install package dependency modules
RUN npm install

# Copy source code to working directory
COPY  ./ ./

# Initial process
CMD ["npm","start"]