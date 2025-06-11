.PHONY: install generate seed dev

install:
	cd apps/api && yarn install
	cd apps/web && yarn install

generate:
	cd apps/api && yarn prisma generate

seed:
	cd apps/api && yarn prisma db seed

dev:
	cd apps/api && yarn dev & cd apps/web && yarn dev 