FROM node:22
WORKDIR /app

COPY package*.json ./
RUN npm install \
 && apt-get update && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/*

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
EXPOSE 3001
CMD ["sh","-c","npx prisma migrate deploy && npm run dev"]
