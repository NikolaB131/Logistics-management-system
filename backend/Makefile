BINARYFILE=./build/bin/app
SOURCEFILE=./cmd/app/main.go

build: $(SOURCEFILE)
	go build -o $(BINARYFILE) $(SOURCEFILE)

build-linux: $(SOURCEFILE)
	GOOS=linux go build -o $(BINARYFILE) $(SOURCEFILE)

run: build
	$(BINARYFILE)

clean:
	rm $(BINARYFILE)

docker-up:
	docker compose up -d --build

docker-down-volumes:
	docker compose down -v

docker-rm:
	docker compose rm -f -s

docker-rm-volumes:
	docker compose rm -f -s -v
