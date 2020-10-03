docker run -p 5432:5432 --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres
docker run -p 6379:6379 --name some-redis2 -d redis
