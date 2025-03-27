FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port Vite uses
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev", "--", "--host"]
