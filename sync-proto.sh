#!/bin/bash

# Script to sync proto files from Shared/Contracts to service-specific Protos directories
# This ensures all services use the same proto definitions

# TODO Only copy necessary files instead of all

echo "Syncing proto files..."

cp services/Shared/Contracts/*.proto services/Backend/Protos/
echo "✓ Copied .proto files to Backend/Protos/ (readonly)"

cp services/Shared/Contracts/*.proto services/Content/Protos/
echo "✓ Copied .proto files to Content/Protos/ (readonly)"

cp services/Shared/Contracts/*.proto services/Generator/Protos/
echo "✓ Copied .proto files to Generator/Protos/ (readonly)"

echo "Proto files synced successfully!"
echo ""
echo "Note: Run this script whenever you update proto files in Shared/Contracts/"
echo "This ensures all services use the same proto definitions."
