FROM node:dubnium-alpine
WORKDIR /app
COPY . /app
RUN npm install \
    && npm run build
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
