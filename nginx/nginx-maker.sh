#!/bin/bash

PATH_TO_BUILD='build'
PATH_TO_TEMP='temp.txt'
PATH_TO_CONF='./nginx.conf'
PATH_TO_DIR='/build'

rm -fr $PATH_TO_TEMP
rm -fr $PATH_TO_CONF
touch $PATH_TO_TEMP
touch $PATH_TO_CONF

touch $PATH_TO_TEMP

# IFS=' '
FILES_LIST=$(find $PATH_TO_BUILD -maxdepth 20 -type f -not -path '*/\.*' | sort)


for FILE_PATH in ${FILES_LIST[@]};
do
    if [[ $FILE_PATH != *".html"* ]] && [[ $FILE_PATH != *".map"* ]] && [[ $FILE_PATH != *".txt"* ]] && [[ $FILE_PATH != *".woff"* ]] && [[ $FILE_PATH != *".woff2"* ]];
    then
        NGINX_REPLACEMENT="${FILE_PATH/build/'\t\t\thttp2_push '}"';'
        echo -e $NGINX_REPLACEMENT >> $PATH_TO_TEMP
    fi
done

IFS=' '
FULL_PUSH_LIST=$(cat $PATH_TO_TEMP)

cat << _EOF_ > $PATH_TO_CONF
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
	worker_connections 768;
}

http {
	sendfile on;

	include /etc/nginx/mime.types;
	default_type application/octet-stream;

	ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
	ssl_prefer_server_ciphers on;

	server {
		listen 443 ssl http2;
		listen [::]:443 ssl http2;

		ssl_certificate     /certs/server.crt;
		ssl_certificate_key /certs/server.key;

		http2_max_concurrent_pushes 1000;
		http2_max_requests 1000;

		server_name _;

		root ${PATH_TO_DIR};

		location / {
${FULL_PUSH_LIST}
			
			try_files \$uri /index.html;
		}
	}
}
_EOF_

rm -fr $PATH_TO_TEMP
