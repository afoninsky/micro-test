#!/bin/bash
### run deployment from local machine (not CI) to google cloud
### deps: docker, gcloud
### usage: script.sh staging|production [version]

set -e
GOOGLE_PROJECT_NAME="spair-api" # replace with own project
CLUSTER_NAME="edissons" # replace with own cluster name

REGISTRY_URL="us.gcr.io"
NAME=`node -e "console.log(require('./package').name)"`
VERSION=${2:-v`node -e "console.log(require('./package').version)"`}
CONFIGMAP=${NAME}-config
NAMESPACE="default"

# case "$1" in
#   "staging")
#     echo "Deploy to staging"
#     NAMESPACE="fulldive-staging"
#     ;;
#   "production")
#     echo "Deploy to production"
#     NAMESPACE="fulldive"
#     ;;
#   *)
#     echo "usage: script.sh staging|production [version]"
#     exit
#     ;;
# esac

IMAGE_TAG=$REGISTRY_URL/$GOOGLE_PROJECT_NAME/$NAME:$VERSION

# perform quick tests
npm test

# build image and push it to google
echo "Building image..."
docker build -t $IMAGE_TAG .
echo "Pushing image to remote registry $IMAGE_TAG"
gcloud docker push $IMAGE_TAG

# update configmap for specified env
echo "Generate config..."
config_dir=`mktemp -d`
cp config/default.js $config_dir/default.js
cp config/$1.js $config_dir/local.js
sleep 1
kubectl create configmap $CONFIGMAP --from-file=$config_dir --dry-run -o yaml | kubectl --namespace=$NAMESPACE replace configmap $CONFIGMAP -f -
sleep 3
rm -R $config_dir

# update deployment
echo "Pushing new image into server..."
kubectl patch --namespace=$NAMESPACE -f kubernetes/deployment.yaml -p '{"spec":{"template":{"spec":{"containers":[{"name":"service","image":"'"$IMAGE_TAG"'"}]}}}}'

# remove temp
docker rmi $IMAGE_TAG
