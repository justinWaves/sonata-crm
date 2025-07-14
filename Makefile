.PHONY: install generate seed dev migrate reset

install:
	cd apps/api && yarn install
	cd apps/web && yarn install

generate:
	cd apps/api && yarn prisma generate

seed:
	cd apps/api && yarn seed

# Development
dev: ## Start both frontend and backend servers
	@echo "Starting development servers..."
	@echo "API: http://localhost:4000"
	@echo "Web: http://localhost:3001"
	@echo "Press Ctrl+C to stop all servers"
	@cd apps/api && yarn dev & cd apps/web && yarn dev & wait

migrate:
	cd apps/api && npx prisma migrate dev

reset:
	cd apps/api && npx prisma migrate reset --force 