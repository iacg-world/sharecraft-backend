FROM node:16-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
RUN npm run tsc
RUN apk add --no-cache python3=3.7
RUN apk add py3-pip
RUN pip install pyodps
RUN pip install python-dotenv
EXPOSE 7001
CMD npx egg-scripts start --title=sharecraft-backend