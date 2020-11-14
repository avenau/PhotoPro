#!/bin/bash


dev=0
localfs=0
showdownLength=1440

# Parse args
for arg in $@
do
  if [ "$arg" = "-d" ]
  then
    dev=1
  elif [ "$arg" = "-l" ]
  then
    localfs=1
  elif [ "$arg" = "-s" ]
  then
    # Do nothing, -s is more important as prev
    :
  elif [ "$prev" = "-s" ]
  then
    if [ $arg -gt 0 ]
    then
      localfs=1
    else
      echo "Error: Showdown duration of $arg minutes is invalid."
      exit 1
    fi
  elif [ "$arg" = "-h" ] || [ "$arg" = "--help" ]
  then
      echo "Usage: prepare.sh [OPTION]"
      echo "  -d,            Start in development mode"
      echo "  -l,            Use local database"
      echo "  -s <minutes>,  Change the showdown duration"
      echo "  -h, --help     Show help options"
      exit 0
  elif [[ "$arg" =~ ^- ]]
  then
    echo -e "Unknown option $arg\nUse --help or -h for more information." >&2
    exit 1
  fi
  prev="$arg"
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

if [ $localfs -eq 1 ]
then
  port_api=8101
  while [[ `netstat -taln | egrep $port_api` != "" ]]
  do
    echo "Failed on port $port_api, trying another"
    port_api=$((port_api + 1))
  done
  echo "========== Running fs_api on port $port_api =============="

  export FS_API_URL="http://localhost:$port_api"
  ./utils/run_fs_api.sh $port_api &
  sleep 0.1
else
  echo "========== Using remote fs_api at https://photopro.fsapi.coen-townson.me =============="
  export FS_API_URL="https://photopro.fsapi.coen-townson.me"
fi

echo "========== Running backend on port $port_b =============="

./utils/run_back.sh $port_b $showdownLength
