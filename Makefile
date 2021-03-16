gendiff:
	node bin/gendiff.js
install:
	npm install
test:
	npm test
lint:
	npx eslint .
test-coverage:
	npm test -- --coverage --coverageProvider=v8