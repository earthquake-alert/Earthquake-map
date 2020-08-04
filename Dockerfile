FROM python:3.6

COPY src /src
COPY Pipfile /Pipfile
COPY Pipfile.lock /Pipfile.lock

RUN pip install pipenv
RUN pipenv install --system --deploy

EXPOSE 5000
