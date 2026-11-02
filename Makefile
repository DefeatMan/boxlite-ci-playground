.PHONY: lint test build verify isolation publish
lint:
	@for file in src/*.mjs tests/*.mjs scripts/*.mjs; do node --check "$$file" || exit; done
	@git diff --check
test:
	node --test tests/*.test.mjs
build:
	mkdir -p dist
	tar -czf dist/playground.tar.gz src package.json README.md
	node scripts/checksum.mjs
verify:
	node scripts/checksum.mjs verify
	mkdir -p dist/unpacked
	tar -xzf dist/playground.tar.gz -C dist/unpacked
	node --input-type=module -e 'import {sum} from "./dist/unpacked/src/sum.mjs"; if (sum([20, 22]) !== 42) throw Error("Packaged code failed");'
isolation:
	node scripts/check-isolation.mjs
publish:
	node scripts/publish-release.mjs
