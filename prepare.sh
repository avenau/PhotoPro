#!/bin/bash

local=0
dev=0

for arg in $@
do
  if [ "$arg" = "-l" ]
  then
    local=1
    continue
  fi
  if [ "$arg" = "-d" ]
  then
    dev=1
    continue
  fi
  if [ "$arg" = "-h" ] || [ "$arg" = "--help" ]
  then
    echo "Usage: prepare.sh [OPTION]"
    echo "  -d,         Only install but don't build production"
    echo "  -l,         Download images from the remote filesystem"
    echo "  -h, --help  Show help options"
    exit 0
  fi
  if [[ "$arg" =~ ^- ]]
  then
    echo -e "Unknown option $arg\nUse --help or -h for more information." >&2
    exit 1
  fi
done


echo "========== Beginning installation =============="
./utils/install.sh
if [ $? -ne 0 ]
then
  echo "Something went wrong with the installation..."
  exit 1
fi

if [ $local -eq 1 ]
then
  ./utils/download_fs.sh
  if [ $? -ne 0 ]
  then
    echo "Something went wrong with the filesystem download..."
    exit 1
  fi
fi

if [ $dev -eq 1 ]
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
