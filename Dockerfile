FROM nikolaik/python-nodejs:python3.6-nodejs14

COPY src /src
COPY Pipfile /Pipfile
COPY Pipfile.lock /Pipfile.lock
COPY package.json /package.json
COPY tsconfig.json /tsconfig.json
COPY webpack.config.js /webpack.config.js
COPY yarn.lock /yarn.lock

RUN yarn install
RUN yarn run build
RUN pip install pipenv
RUN pipenv install --system --deploy

EXPOSE 8080
