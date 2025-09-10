# Canvas Management Application

Canvas Management is a Next.js web application that provides a user interface for managing Canvas LMS courses, modules, assignments, quizzes, and pages. It features real-time file synchronization through WebSocket connections and supports Docker containerization.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap, Build, and Test the Repository
- Install pnpm globally: `npm install -g pnpm`
- Install dependencies: `pnpm install --config.confirmModulesPurge=false` -- takes 25 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- Build the application: `pnpm run build` -- takes 47 seconds. NEVER CANCEL. Set timeout to 90+ minutes for CI environments.
- Run tests: `pnpm run test` -- takes 8 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- Run linting: `pnpm run lint` -- takes 13 seconds. NEVER CANCEL. Set timeout to 30+ seconds.

### Environment Setup
- Copy `.env.test` to `.env.local` for local development
- Set required environment variables:
  - `STORAGE_DIRECTORY="./temp/storage"` - Directory for course data storage
  - `NEXT_PUBLIC_ENABLE_FILE_SYNC=true` - Enable file synchronization features
  - `CANVAS_TOKEN="your_canvas_api_token"` - Canvas API token (optional for local development)
- Create storage directory: `mkdir -p temp/storage`
- Create simple globalSettings.yml: `echo "courses: []" > globalSettings.yml`

### Run the Development Server
- **Development server without WebSocket**: `pnpm run devNoSocket` -- starts in 1.5 seconds
- **Development server with WebSocket**: `pnpm run dev` -- runs `pnpm install` then starts WebSocket server with Next.js
- Access the application at: `http://localhost:3000`
- WebSocket server enables real-time file watching and synchronization

### Run Production Build
- **Production server**: `pnpm run start` -- starts production WebSocket server with Next.js
- Requires completing the build step first

### Docker Development
- **Local Docker build**: `./build.sh` -- takes 5+ minutes. NEVER CANCEL. Set timeout to 120+ minutes.
- **Development with Docker**: Use `run.sh` or `docker-compose.dev.yml`
- **Production with Docker**: Use `docker-compose.yml`
- Note: Docker builds may fail in sandboxed environments due to certificate issues

## Validation

### Manual Testing Scenarios
- ALWAYS run through complete end-to-end scenarios after making changes
- Start the development server and verify the main page loads with "Add New Course" and "Add Existing Course" buttons
- Test course creation workflow (will fail without valid Canvas API token, which is expected)
- Verify WebSocket connectivity shows "Socket connected successfully" in browser console
- Check that file system watching works when NEXT_PUBLIC_ENABLE_FILE_SYNC=true

### Required Validation Steps
- Always run `pnpm run lint` before committing changes
- Always run `pnpm run test` to ensure tests pass
- Always run `pnpm run build` to verify production build works
- Test both `devNoSocket` and `dev` modes to ensure WebSocket functionality works

## Common Tasks

### Build System Requirements
- **Node.js**: Version 20+ (validated with v20.19.5)
- **Package Manager**: pnpm v10+ (install with `npm install -g pnpm`)
- **Build Tool**: Next.js 15.3.5 with React 19

### Technology Stack
- **Frontend**: Next.js 15.3.5, React 19, TypeScript 5.8.3
- **Styling**: Tailwind CSS 4.1.11
- **Testing**: Vitest 3.2.4 with @testing-library/react
- **Linting**: ESLint 9.31.0 with Next.js and TypeScript configs
- **Real-time**: WebSocket with Socket.IO for file watching
- **API**: tRPC for type-safe API calls
- **Canvas Integration**: Axios for Canvas LMS API communication

### Key Project Structure
```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
├── features/           # Feature-specific code (local file handling, Canvas API)
├── services/           # Utility services and API helpers
└── websocket.js        # WebSocket server for file watching
```

### Development Workflow Tips
- Use `pnpm dev` for full development with file watching
- Use `pnpm devNoSocket` for faster startup when WebSocket features not needed
- Monitor console for WebSocket connection status and Canvas API errors
- Canvas API errors are expected without valid CANVAS_TOKEN
- File sync requires NEXT_PUBLIC_ENABLE_FILE_SYNC=true

### Storage Configuration
- Course data stored in markdown files within storage directory
- `globalSettings.yml` controls which courses appear in UI
- Each course requires settings.yml file in its directory
- Images supported via volume mounts to `/app/public/images/`

### Frequent Command Outputs

#### Repository Root Structure
```
.
├── README.md
├── package.json
├── pnpm-lock.yaml
├── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
├── build.sh
├── run.sh
├── globalSettings.yml
├── eslint.config.mjs
├── vitest.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── postcss.config.mjs
└── src/
```

#### Key Package Scripts
```json
{
  "dev": "pnpm install --config.confirmModulesPurge=false && node src/websocket.js",
  "devNoSocket": "next dev",
  "build": "next build",
  "start": "NODE_ENV=production node src/websocket.js",
  "lint": "eslint . --config eslint.config.mjs && tsc && next lint",
  "test": "vitest"
}
```

## Critical Timing Information

- **NEVER CANCEL** any build or test commands - wait for completion
- **Dependency Installation**: ~25 seconds (set 60+ second timeout)
- **Production Build**: ~47 seconds (set 90+ minute timeout for CI)
- **Test Suite**: ~8 seconds (set 30+ second timeout)
- **Linting**: ~13 seconds (set 30+ second timeout)
- **Development Server Startup**: ~1.5 seconds
- **Docker Build**: 5+ minutes locally (set 120+ minute timeout)

## Error Handling

### Expected Errors During Development
- Canvas API connection errors without valid CANVAS_TOKEN
- Socket.IO 404 errors when running devNoSocket mode
- Docker build certificate issues in sandboxed environments
- Course settings file not found errors with empty storage directory

### Troubleshooting
- If WebSocket connection fails, check NEXT_PUBLIC_ENABLE_FILE_SYNC environment variable
- If build fails, ensure pnpm is installed globally
- If tests fail with storage errors, check STORAGE_DIRECTORY environment variable
- For Canvas integration, set valid CANVAS_TOKEN environment variable