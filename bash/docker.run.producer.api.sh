#!/bin/bash

docker run  --name  sergeyd_mq_producer_api -p 8090:8090 -d sergeyd/rabbitmq-producer-api
