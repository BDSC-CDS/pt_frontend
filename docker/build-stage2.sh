#!/bin/bash

set -e

docker build --pull -f dockerfiles/stage2.dockerfile -t registry.rdeid.unil.ch/pt-frontend:latest ..
docker push registry.rdeid.unil.ch/pt-frontend:latest
