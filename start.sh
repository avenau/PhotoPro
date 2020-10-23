#!/bin/bash

port_b=8001
while [[ `netstat -taln | egrep $port_b` != "" ]]
do
  echo "Failed on port $port_b, trying another"
  port_b=$((port_b + 1))
done

port_f=5001
while [[ `netstat -taln | egrep $port_f` != "" ]]
do
  echo "Failed on port $port_f, trying another"
  port_f=$((port_f + 1))
done
echo "========== Running frontend on port $port_f =============="
echo "========== Running backend on port $port_b =============="

./utils/run_front.sh $port_f $port_b &
sleep 0.1
./utils/run_back.sh $port_b
