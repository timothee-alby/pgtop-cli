build:
	docker-compose build pgtop-tests

.PHONY: test
test:
	docker-compose run --rm pgtop-tests npm run test

test_verbose:
	TEST_OUTPUT=1 make test

coverage:
	docker-compose run --rm pgtop-tests npm run coverage

lint:
	docker-compose run --rm pgtop-tests npm run lint

format:
	docker-compose run --rm pgtop-tests npm run format
