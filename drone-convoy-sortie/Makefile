# Drone Convoy Sortie - Makefile
.PHONY: help install dev build prod clean logs shell test lint format

# Default target
help:
	@echo "🚁 Drone Convoy Sortie - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make install     - Install dependencies"
	@echo "  make dev         - Start development server"
	@echo "  make dev-docker  - Start development with Docker"
	@echo ""
	@echo "Production:"
	@echo "  make build       - Build production assets"
	@echo "  make prod        - Start production container"
	@echo "  make prod-up     - Start production in background"
	@echo ""
	@echo "Docker Management:"
	@echo "  make up          - Start all services"
	@echo "  make down        - Stop all services"
	@echo "  make logs        - Show container logs"
	@echo "  make shell       - Open shell in container"
	@echo "  make clean       - Clean up containers and volumes"
	@echo ""
	@echo "Quality:"
	@echo "  make lint        - Run ESLint"
	@echo "  make format      - Format code with Prettier"
	@echo "  make test        - Run tests"
	@echo ""
	@echo "Utilities:"
	@echo "  make status      - Show service status"
	@echo "  make health      - Health check all services"

# Development
install:
	npm install

dev:
	npm run dev

dev-docker:
	docker-compose --profile dev up drone-convoy-dev

# Production
build:
	npm run build

prod:
	docker-compose up drone-convoy-frontend

prod-up:
	docker-compose up -d drone-convoy-frontend

# Docker management
up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

shell:
	docker-compose exec drone-convoy-frontend sh

clean:
	docker-compose down --volumes --remove-orphans
	docker system prune -f
	docker volume prune -f

# Quality assurance
lint:
	npm run lint

format:
	npx prettier --write "src/**/*.{js,jsx,css,md}"

test:
	npm run test

# Utilities
status:
	docker-compose ps

health:
	@echo "🔍 Checking service health..."
	@curl -s http://localhost:8080/health | jq '.' || echo "Service not responding"

# Quick setup commands
quick-start: install build prod-up
	@echo "🚀 Drone Convoy Sortie started at http://localhost:8080"

quick-dev: install dev-docker
	@echo "🛠️ Development server started at http://localhost:5173"

# Backup and restore
backup:
	mkdir -p backups
	docker run --rm -v drone-convoy-redis-data:/data -v $(PWD)/backups:/backup alpine tar czf /backup/redis-backup-$(shell date +%Y%m%d_%H%M%S).tar.gz -C /data .

restore:
	@read -p "Enter backup file name: " backup && \
	docker run --rm -v drone-convoy-redis-data:/data -v $(PWD)/backups:/backup alpine tar xzf /backup/$$backup -C /data

# Environment setup
setup-env:
	@echo "Setting up environment..."
	@if [ ! -f .env ]; then \
		echo "GOOGLE_MAPS_API_KEY=your_api_key_here" > .env; \
		echo "REACT_APP_VERSION=1.0.0" >> .env; \
		echo "NODE_ENV=development" >> .env; \
		echo "📝 Created .env file - please update with your Google Maps API key"; \
	fi

# Monitoring
watch-logs:
	docker-compose logs -f --tail=100

monitor:
	watch -n 2 'docker-compose ps && echo "" && docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"'