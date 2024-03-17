# Start your image with a node base image
FROM node:alpine

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Copy local directories to the current local directory of our docker image (/app)
# Copy the rest of the code in the container
COPY . .

# Install node packages, install serve, build the app, and remove dependencies at the end
RUN npm ci
    # && npx prisma generate \
    # && npx prisma migrate deploy

EXPOSE 4000

# Start the app using serve command
CMD [ "npm", "run", "start" ]
