#!/bin/bash

set -e

docker build --pull -f dockerfiles/stage1.dockerfile -t registry.rdeid.unil.ch/pt-frontend-stage1 ..
docker push registry.rdeid.unil.ch/pt-frontend-stage1
