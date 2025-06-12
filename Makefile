.PHONY: install generate seed dev migrate reset

install:
	cd apps/api && yarn install
	cd apps/web && yarn install

generate:
	cd apps/api && yarn prisma generate

seed:
	cd apps/api && yarn seed

dev:
	cd apps/api && yarn dev & cd apps/web && yarn dev

migrate:
	cd apps/api && npx prisma migrate dev

reset:
	cd apps/api && npx prisma migrate reset --force 