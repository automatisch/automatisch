FROM mcr.microsoft.com/playwright:v1.49.0-jammy

# Install Node.js 22.15.0
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# Install libnss3-tools and mkcert
RUN apt-get update && apt-get install -y libnss3-tools curl && \
    curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64" && \
    chmod +x mkcert-v*-linux-amd64 && \
    mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert && \
    mkcert -install
