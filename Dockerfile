# Start your image with a node base image
FROM node:20-alpine3.18

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Copy local directories to the current local directory of our docker image (/app)
# Copy the rest of the code in the container
COPY . .

# Install node packages, install serve, build the app, and remove dependencies at the end
# RUN npm ci && \
#     npx prisma generate && \
#     npx prisma migrate deploy

RUN npm install --omit=dev
RUN npx prisma generate

EXPOSE 4000

# Start the app using serve command
# CMD [ "npm", "run", "start" ]
CMD ["npm", "run", "start:prisma"]
