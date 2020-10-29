#!/bin/bash

dev=0
localfs=0

# Parse args
for arg in $@
do
  if [ "$arg" = "-d" ]
  then
    dev=1
    continue
  fi
  if [ "$arg" = "-l" ]
  then
    localfs=1
    continue
  fi
  if [[ "$arg" =~ ^- ]]
  then
    echo -e "Unknown option $arg\nUsage: $0 [-d] [-l]" >&2
    exit 1
  fi
done


port_b=8001
while [[ `netstat -taln | egrep $port_b` != "" ]]
do
  echo "Failed on port $port_b, trying another"
  port_b=$((port_b + 1))
done

if [ "$1" = "-d" ]
then
  echo "var BACKEND_PORT = $port_b;" > frontend/public/config.js
fi

if [ $dev -eq 0 ]
then
  port_f=5001
  while [[ `netstat -taln | egrep $port_f` != "" ]]
  do
    echo "Failed on port $port_f, trying another"
    port_f=$((port_f + 1))
  done
  echo "========== Running frontend on port $port_f =============="

  ./utils/run_front.sh $port_f $port_b &
  sleep 0.1
fi

if [ $localfs -eq 0 ]
then
  port_api=8101
  while [[ `netstat -taln | egrep $port_f` != "" ]]
  do
    echo "Failed on port $port_f, trying another"
    port_f=$((port_f + 1))
  done
  echo "========== Running fs_api on port $port_api =============="

  export FS_API_URL="http://localhost:$port_api"
  ./utils/run_fs_api.sh $port_api &
  sleep 0.1
else
  echo "========== Using remote fs_api at https://fs-api.coen-townson.me =============="
  export FS_API_URL="https://fs-api.coen-townson.me"
fi

echo "========== Running backend on port $port_b =============="

./utils/run_back.sh $port_b
