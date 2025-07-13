#!/bin/bash

# Script to run Heimdall Web E2E tests with proper setup

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Heimdall Web E2E Test Runner...${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Check if Playwright browsers are installed
if [ ! -d "$HOME/Library/Caches/ms-playwright" ]; then
    echo -e "${YELLOW}Installing Playwright browsers...${NC}"
    npx playwright install
fi

# Check if the backend is running
if ! curl -s http://localhost:8080/api/v1/admin/health > /dev/null; then
    echo -e "${RED}❌ Backend API is not running on port 8080${NC}"
    echo -e "${YELLOW}Please start the backend with: cd ../heimdall-api && make admin${NC}"
    exit 1
fi

# Check if the frontend dev server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo -e "${YELLOW}Frontend is not running. Starting dev server...${NC}"
    npm run dev &
    DEV_PID=$!
    
    # Wait for dev server to start
    echo -e "${YELLOW}Waiting for dev server to start...${NC}"
    sleep 10
    
    # Check again
    if ! curl -s http://localhost:3000 > /dev/null; then
        echo -e "${RED}❌ Failed to start dev server${NC}"
        kill $DEV_PID 2>/dev/null
        exit 1
    fi
    
    echo -e "${GREEN}✅ Dev server started${NC}"
fi

# Run tests based on arguments
if [ $# -eq 0 ]; then
    echo -e "${GREEN}Running all E2E tests...${NC}"
    npm run test:e2e
else
    case "$1" in
        "ui")
            echo -e "${GREEN}Running tests in UI mode...${NC}"
            npm run test:e2e:ui
            ;;
        "debug")
            echo -e "${GREEN}Running tests in debug mode...${NC}"
            npm run test:e2e:debug
            ;;
        "headed")
            echo -e "${GREEN}Running tests with visible browser...${NC}"
            npm run test:e2e:headed
            ;;
        "auth")
            echo -e "${GREEN}Running authentication tests...${NC}"
            npm run test:e2e:auth
            ;;
        "posts")
            echo -e "${GREEN}Running post management tests...${NC}"
            npm run test:e2e:posts
            ;;
        "tags")
            echo -e "${GREEN}Running tag management tests...${NC}"
            npm run test:e2e:tags
            ;;
        "comments")
            echo -e "${GREEN}Running comment management tests...${NC}"
            npm run test:e2e:comments
            ;;
        "report")
            echo -e "${GREEN}Opening test report...${NC}"
            npm run test:e2e:report
            ;;
        "codegen")
            echo -e "${GREEN}Starting Playwright codegen...${NC}"
            npm run test:e2e:codegen
            ;;
        *)
            echo -e "${RED}Unknown command: $1${NC}"
            echo "Available commands:"
            echo "  ui       - Run tests in UI mode"
            echo "  debug    - Run tests in debug mode"
            echo "  headed   - Run tests with visible browser"
            echo "  auth     - Run authentication tests"
            echo "  posts    - Run post management tests"
            echo "  tags     - Run tag management tests"
            echo "  comments - Run comment management tests"
            echo "  report   - Open test report"
            echo "  codegen  - Start Playwright codegen"
            exit 1
            ;;
    esac
fi

# Cleanup
if [ ! -z "$DEV_PID" ]; then
    echo -e "${YELLOW}Stopping dev server...${NC}"
    kill $DEV_PID 2>/dev/null
fi

echo -e "${GREEN}Test run completed!${NC}"