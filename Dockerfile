FROM node:dubnium-alpine
WORKDIR /app
COPY . /app
RUN npm install \
    && npm run build
EXPOSE 3000
COPY package.json .
ENTRYPOINT ["npm", "start"]
