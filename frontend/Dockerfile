FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends wget git procps && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
