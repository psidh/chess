#!/bin/bash

# Run frontend in the background
cd ./frontend && npm run dev &

# Run backend-1 in the background
cd ./backend-1 && npm run dev &

# Run backend-2 in the background
cd ./backend-2 && npm run dev &

# Wait for all background processes to complete
wait
