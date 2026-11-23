# syntax=docker/dockerfile:1

# Official unprivileged stable NGINX Alpine image (matches app.storehelpa.com)
# Runs as non-root UID 101 and renders /etc/nginx/templates/*.template at startup.
FROM nginxinc/nginx-unprivileged:1.28.0-alpine AS runtime

ENV PORT=8080 \
    NGINX_ENVSUBST_FILTER=^PORT$

USER root
RUN mkdir -p /etc/nginx/snippets /etc/nginx/templates /usr/share/nginx/html \
    && rm -f /etc/nginx/conf.d/default.conf

COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

COPY index.html styles.css script.js site.webmanifest robots.txt /usr/share/nginx/html/
COPY favicon.ico favicon.svg apple-touch-icon.png og-image.png /usr/share/nginx/html/
COPY pwa-192.png pwa-512.png pwa-maskable-512.png /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets

RUN chown -R 101:101 /etc/nginx/snippets /etc/nginx/templates /usr/share/nginx/html
USER 101

EXPOSE 8080
