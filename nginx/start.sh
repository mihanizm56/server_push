#!/bin/bash

bash nginx-maker.sh && docker run -it --name nginx --rm -v $(pwd)/nginx.conf:/nginx.conf -v $(pwd)/certs:/certs -v $(pwd)/build:/build -p 0.0.0.0:443:443 nginx nginx -g 'daemon off;' -c /nginx.conf
