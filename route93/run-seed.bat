@echo off
echo Route93 Production Database Seeding
echo ===================================
echo.

echo This script will help you seed your production database.
echo.
echo Prerequisites:
echo 1. You need your production DATABASE_URL
echo 2. You need psql (PostgreSQL client) installed
echo 3. You need to generate proper password hashes first
echo.

echo Step 1: Generate password hashes
echo Run: node generate-passwords.js
echo.

echo Step 2: Update seed-production.sql with the generated hashes
echo Replace the example hashes with the real ones
echo.

echo Step 3: Run the seed script
echo Replace YOUR_DATABASE_URL with your actual production database URL
echo.

echo Example command:
echo psql "YOUR_DATABASE_URL" -f seed-production.sql
echo.

pause

