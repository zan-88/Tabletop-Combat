FROM node:14-slim

WORKDIR /proj

COPY ./package*.json /proj

RUN npm install

COPY . /proj

ENV NODE_ENV=development
ENV PORT=5000
ENV host=hasted-tables-mysql.cbzkesjtbv7y.us-east-2.rds.amazonaws.com
ENV user=zan
ENV password=bZ2f34E56waYPPd
ENV database=hasted_tables

CMD [ "npm", "run", "server" ]