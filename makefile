# set-up
set-up-ui:
	@echo "Setting up client..."
	cd client && npm install && cd ..
set-up-server:
	@echo "Setting up server..."
	cd server && npm install && cd ..
set-up:
	@echo "Setting up client and server..."
	make set-up-ui && make set-up-server

# run
run-server:
	@echo "Running server..."
	cd server && npm start
run-ui:
	@echo "Running client..."
	cd client && npm start

# run both
run:
	@echo "Running client and server..."
	make run-server & make run-ui

# run with docker
run-docker:
	@echo "Running client and server with docker..."
	docker-compose up