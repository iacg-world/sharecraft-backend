FROM node:16-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
RUN npm run tsc
RUN npm run build:template:prod
EXPOSE 7001
CMD npx egg-scripts start --title=sharecraft-backend
