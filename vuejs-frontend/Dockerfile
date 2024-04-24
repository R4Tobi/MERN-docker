FROM nginx:latest

#COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./vue/dist/ /usr/share/nginx/html/

EXPOSE 80 443

ENTRYPOINT ["nginx", "-g", "daemon off;"]