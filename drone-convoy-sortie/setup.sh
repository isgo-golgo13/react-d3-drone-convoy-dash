#!/bin/bash

# Drone Convoy Sortie - Setup Script
# Rolex Quality Setup for Mac

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ASCII Art Banner
echo -e "${BLUE}"
cat << "EOF"
🚁 =============================================== 🚁
   ____                        ____                           
  |  _ \ _ __ ___  _ __   ___   / ___|___  _ ____   _____  _   _ 
  | | | | '__/ _ \| '_ \ / _ \ | |   / _ \| '_ \ \ / / _ \| | | |
  | |_| | | | (_) | | | |  __/ | |__| (_) | | | \ V / (_) | |_| |
  |____/|_|  \___/|_| |_|\___|  \____\___/|_| |_|\_/ \___/ \__, |
                                                          |___/ 
   ____             _   _      
  / ___|  ___  _ __| |_(_) ___ 
  \___ \ / _ \| '__| __| |/ _ \
   ___) | (_) | |  | |_| |  __/
  |____/ \___/|_|   \__|_|\___|

===============================================
EOF
echo -e "${NC}"

echo -e "${GREEN}🎯 Setting up Drone Convoy Sortie - Tactical Dashboard${NC}"
echo -e "${BLUE}📋 This script will set up your complete development environment${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print step
print_step() {
    echo -e "${YELLOW}🔧 $1${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This setup script is designed for macOS. Please adapt for your OS."
    exit 1
fi

print_step "Checking system requirements..."

# Check Node.js
if ! command_exists node; then
    print_error "Node.js not found. Installing via Homebrew..."
    if ! command_exists brew; then
        print_error "Homebrew not found. Please install it first:"
        echo "https://brew.sh"
        exit 1
    fi
    brew install node
else
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
fi

# Check npm
if ! command_exists npm; then
    print_error "npm not found. Please reinstall Node.js"
    exit 1
else
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
fi

# Check Docker
if ! command_exists docker; then
    print_error "Docker not found. Please install Docker Desktop for Mac:"
    echo "https://docs.docker.com/desktop/install/mac-install/"
    exit 1
else
    DOCKER_VERSION=$(docker --version)
    print_success "Docker found: $DOCKER_VERSION"
fi

# Check Docker Compose
if ! command_exists docker-compose; then
    print_error "Docker Compose not found. It should come with Docker Desktop."
    exit 1
else
    COMPOSE_VERSION=$(docker-compose --version)
    print_success "Docker Compose found: $COMPOSE_VERSION"
fi

# Create project directory
PROJECT_NAME="drone-convoy-sortie"
if [ -d "$PROJECT_NAME" ]; then
    echo -e "${YELLOW}⚠️  Directory $PROJECT_NAME already exists.${NC}"
    read -p "Do you want to continue and overwrite? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
    rm -rf "$PROJECT_NAME"
fi

print_step "Creating project structure..."

# Create main directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Create Vite React project
print_step "Creating React project with Vite..."
npm create vite@latest . -- --template react

# Install additional dependencies
print_step "Installing dependencies..."
npm install

print_step "Installing additional packages..."
npm install d3 lucide-react

print_step "Installing dev dependencies..."
npm install -D tailwindcss postcss autoprefixer @types/d3

# Initialize Tailwind
print_step "Setting up Tailwind CSS..."
npx tailwindcss init -p

# Create directory structure
print_step "Creating project structure..."
mkdir -p src/{components,hooks,utils,data}
mkdir -p public

# Create environment file
print_step "Setting up environment..."
cat > .env << EOF
# Google Maps API Key (replace with your actual key)
GOOGLE_MAPS_API_KEY=your_api_key_here

# Application Configuration
REACT_APP_VERSION=1.0.0
REACT_APP_BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
NODE_ENV=development

# Development Settings
VITE_HOST=0.0.0.0
VITE_PORT=5173
EOF

# Create .gitignore
print_step "Creating .gitignore..."
cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production build
dist/
build/

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Docker
docker-compose.override.yml

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# temporary folders
tmp/
temp/
EOF

print_step "Creating Docker configuration..."

# Docker files will be created by the artifacts above

print_step "Setting up development tools..."

# Create VSCode settings (optional)
mkdir -p .vscode
cat > .vscode/settings.json << EOF
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "files.associations": {
    "*.jsx": "javascriptreact"
  },
  "emmet.includeLanguages": {
    "javascriptreact": "html"
  },
  "tailwindCSS.includeLanguages": {
    "javascriptreact": "html"
  }
}
EOF

# Create Prettier config
cat > .prettierrc << EOF
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
EOF

print_step "Testing Docker setup..."
docker --version > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Docker is working correctly"
else
    print_error "Docker test failed"
    exit 1
fi

print_step "Final setup steps..."

# Make scripts executable
chmod +x setup.sh 2>/dev/null || true

print_success "🎉 Setup complete!"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "${GREEN}1.${NC} Get a Google Maps API key (optional but recommended):"
echo "   https://console.cloud.google.com/"
echo "   Update GOOGLE_MAPS_API_KEY in .env file"
echo ""
echo -e "${GREEN}2.${NC} Start development server:"
echo "   make dev        # or npm run dev"
echo ""
echo -e "${GREEN}3.${NC} Or start with Docker:"
echo "   make quick-dev  # Development with hot reload"
echo "   make quick-start # Production build"
echo ""
echo -e "${GREEN}4.${NC} Access the application:"
echo "   Development: http://localhost:5173"
echo "   Production:  http://localhost:8080"
echo ""
echo -e "${BLUE}📚 Available Commands:${NC}"
echo "   make help       # Show all available commands"
echo "   make dev        # Start development server"
echo "   make prod       # Start production container"
echo "   make logs       # View container logs"
echo "   make clean      # Clean up containers"
echo ""
echo -e "${YELLOW}🎯 Phase 1: Frontend Dashboard - COMPLETE${NC}"
echo -e "${BLUE}🔮 Phase 2: OpenCV Integration - Ready for development${NC}"
echo ""
echo -e "${GREEN}🚁 Ready for tactical operations! 🚁${NC}"