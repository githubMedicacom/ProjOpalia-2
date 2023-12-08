# Use an official Node.js runtime as the base image
FROM node:14.17.0

# Set the working directory inside the container
WORKDIR /server

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your backend application uses (for example, 8000)
EXPOSE 3000

# Start the backend application
CMD [ "npm", "start" ]
