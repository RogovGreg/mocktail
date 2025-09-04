#!/bin/bash

# Script to sync proto files from Shared/Contracts to service-specific Protos directories
# This ensures all services use the same proto definitions

echo "Syncing proto files..."

# Copy content.proto to Backend service
cp services/Shared/Contracts/content.proto services/Backend/Protos/
echo "✓ Copied content.proto to Backend/Protos/"

# Copy content.proto to Content service  
cp services/Shared/Contracts/content.proto services/Content/Protos/
echo "✓ Copied content.proto to Content/Protos/"

echo "Proto files synced successfully!"
echo ""
echo "Note: Run this script whenever you update the proto file in Shared/Contracts/"
echo "This ensures all services use the same proto definitions."
