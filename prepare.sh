#!/bin/bash

# Help features
if [ "$1" = "-h" ] || [ "$1" = "--help" ]
then
    echo "Usage: prepare.sh [OPTION]"
    echo "  -l,         Only install but don't build production"
    echo "  -h, --help  Show help options"
    exit 0
fi

echo "========== Beginning installation =============="
./utils/install.sh
if [ $? -ne 0 ]
then
  echo "Something went wrong with the installation..."
  exit 1
fi

if [ "$1" = "-l" ]
then
  exit 0
fi

echo "========== Beginning build =============="
./utils/build.sh
if [ $? -ne 0 ]
then
  echo "Something went wrong with the production build..."
  exit 1
fi

echo '========== Preperation complete! Project is read to be run :) =============='
