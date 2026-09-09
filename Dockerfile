FROM node:20 

WORKDIR /mindhub

COPY . .

RUN npm build 

EXPOSE 3000

CMD ["npm", "start"]