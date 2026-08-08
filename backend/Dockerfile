FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /workspaces/Inheritance

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    netcat-openbsd \
    curl \
    wget \
    git \
    openssh-client \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt /workspaces/Inheritance/backend/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /workspaces/Inheritance/backend/requirements.txt

COPY . /workspaces/Inheritance/backend/

EXPOSE 8000

CMD ["sleep", "infinity"]
