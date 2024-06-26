FROM node:18
USER root
RUN apt-get update && \
    apt-get install -y python3 python3-pip unzip default-jre libpq-dev
RUN npm install -g pnpm@8.6.1
