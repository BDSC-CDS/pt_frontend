#!/bin/bash

set -e

mkdir -p ./chart/files
rm -rf ./chart/files/*
cp -r ../configs/$env/* ./chart/files/

helm version
helm template --namespace "$env" --values ./chart/files/values.yaml --set-string "image=registry.rdeid.unil.ch/pt-frontend:${IMAGE_TAG}" ./chart

echo ""
echo "deploying..."
helm upgrade --install --create-namespace --namespace "$env" --values ./chart/files/values.yaml --set-string "image=registry.rdeid.unil.ch/pt-frontend:${IMAGE_TAG}" "${RELEASE_NAME}" ./chart
echo "done"