#!/bin/bash

set -e

docker build --pull -f dockerfiles/stage2.dockerfile -t registry.rdeid.unil.ch/pt-frontend:${IMAGE_TAG} ..
docker push registry.rdeid.unil.ch/pt-frontend:${IMAGE_TAG}


if [[ ${IMAGE_TAG} =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    docker tag registry.rdeid.unil.ch/pt-frontend:${IMAGE_TAG} ghcr.io/bdsc-cds/pt-frontend:${IMAGE_TAG}
    docker push ghcr.io/bdsc-cds/pt-frontend:${IMAGE_TAG}
fi

