FROM node:16-alpine as node_builder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
RUN npm run tsc
FROM python:3.7 as python_builder
RUN pip install pyodps
WORKDIR /usr/src/app
COPY . /usr/src/app
FROM node:16-alpine
WORKDIR /usr/src/app
COPY --from=python_builder /usr/src/app /usr/src/app
COPY --from=node_builder /usr/src/app /usr/src/app
EXPOSE 7001
CMD npx egg-scripts start --title=sharecraft-backend
