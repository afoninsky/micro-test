#!/bin/bash

# Exit on any error
set -e

sudo /opt/google-cloud-sdk/bin/gcloud docker push us.gcr.io/${PROJECT_NAME}/hello
sudo chown -R ubuntu:ubuntu /home/ubuntu/.kube
kubectl patch deployment micro-test -p '{"spec":{"template":{"spec":{"containers":[{"name":"micro-test","image":"us.gcr.io/spair-api/hello:'"$CIRCLE_SHA1"'"}]}}}}'
