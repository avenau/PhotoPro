#!/bin/bash

if ! [ "$1" = "-d" ]
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

echo "========== Running backend on port $port_b =============="

./utils/run_back.sh $port_b
