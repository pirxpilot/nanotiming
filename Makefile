check: lint

lint:
	./node_modules/.bin/biome ci

format:
	./node_modules/.bin/biome check --fix

.PHONY: check format lint
