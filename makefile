# Docker image configuration
IMAGE_NAME = tlm-crm
REGISTRY = savekikiz
VERSION ?= latest

FULL_IMAGE_NAME = $(REGISTRY)/$(IMAGE_NAME):$(VERSION)
FULL_COMPOSE_CMD = VERSION=$(VERSION) IMAGE_NAME=$(IMAGE_NAME) REGISTRY=$(REGISTRY)

build:
	@echo "Building Docker image: $(FULL_IMAGE_NAME)"
	$(FULL_COMPOSE_CMD) docker compose --env-file .env -f docker/docker-compose.yml build
	@echo "Build complete: $(FULL_IMAGE_NAME)"

push:
	@echo "Pushing Docker image: $(FULL_IMAGE_NAME)"
	docker push $(REGISTRY)/$(IMAGE_NAME):$(VERSION)
	@echo "Push complete: $(FULL_IMAGE_NAME)"

up:
	@echo "Starting containers..."
	$(FULL_COMPOSE_CMD) docker compose --env-file .env -f docker/docker-compose.yml up -d
	