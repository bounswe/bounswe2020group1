FROM python:3

# Prevents Python from writing pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1
# Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

RUN mkdir /backend
WORKDIR /backend

COPY requirements.txt /backend/
RUN pip install -r requirements.txt

COPY . /backend/

ENTRYPOINT ["/backend/entrypoint.sh"]

EXPOSE 8000
