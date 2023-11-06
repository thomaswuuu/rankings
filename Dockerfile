# Specify a base image
FROM node:16-alpine

# Setup working directory
WORKDIR /app

# Set environment variables
 # MongoDB
ENV MONGO_URI=${MONGO_URI}
# KKBOX
ENV KK_ID=${KK_ID}
ENV KK_SECRET=${KK_SECRET}
# Spotify
ENV SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID}
ENV SPOTIFY_CLIENT_SECRET=${SPOTIFY_CLIENT_SECRET}
# Firebase
ENV FIREBASE_API_KEY=${FIREBASE_API_KEY}
ENV FIREBASE_AUTHDOMAIN=${FIREBASE_AUTHDOMAIN}
ENV FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
ENV FIREBASE_APPID=${FIREBASE_APPID}
ENV ADMIN_UID=${ADMIN_UID}

# Copy package.json to working directory
COPY package*.json ./

# Install package dependency modules
RUN npm install

# Copy source code to working directory
COPY ./ ./

# Expose PORT
EXPOSE 3000

# Initial process
CMD ["npm","start"]