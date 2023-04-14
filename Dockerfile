FROM nginx:1.21.4
COPY ./site/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
