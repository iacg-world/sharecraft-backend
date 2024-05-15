FROM node:16-alpine
USER root
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
RUN npm run tsc
RUN echo -e 'https://mirrors.aliyun.com/alpine/v3.14/main/ \nhttps://mirrors.aliyun.com/alpine/v3.14/community/' > /etc/apk/repositories
RUN sudo apk update && sudo apk upgrade
RUN apk add --no-cache python3
RUN apk add py3-pip
RUN pip install pyodps
RUN pip install python-dotenv
EXPOSE 7001
CMD npx egg-scripts start --title=sharecraft-backend