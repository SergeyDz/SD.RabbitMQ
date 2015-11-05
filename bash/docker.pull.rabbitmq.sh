docker stop sdzyuban-rabbitmq
docker rm sdzyuban-rabbitmq

docker pull rabbitmq 

docker run --name sdzyuban-rabbitmq -p 15672:15672 -p 5672:5672  -d rabbitmq

docker exec -it sdzyuban-rabbitmq rabbitmq-plugins enable rabbitmq_management
docker exec -it sdzyuban-rabbitmq rabbitmqctl stop
docker exec -it sdzyuban-rabbitmq  apt-get install rabbitmq-server
docker exec -it sdzyuban-rabbitmq  rabbitmq-server -detached

sleep 10s
docker start sdzyuban-rabbitmq