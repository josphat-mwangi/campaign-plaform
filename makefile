dev:
	@echo "Starting dev server..."
	@bun run --bun dev 

tidy:
	@echo "Tidying up..."
	@bun install --yarn

lint:
	@echo "Linting..."
	@bun run --bun lint

pretty:
	@echo "Prettifying..."
	@bun run --bun pretty

build:
	@echo "Building..."
	@bun run --bun build
