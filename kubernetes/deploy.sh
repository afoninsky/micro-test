#!/bin/bash
### run deployment from local machine (not CI) to google cloud
### deps: docker, gcloud
### usage: [NODE_ENV=production] ./deploy.sh [namespace] [version]

GOOGLE_PROJECT_NAME="spair-api" # replace with own project
CLUSTER_NAME="edissons" # replace with own cluster name
REGISTRY_URL="us.gcr.io"

NAME=`node -e "console.log(require('./package').name)"`
VERSION=${2:-v`node -e "console.log(require('./package').version)"`}
CONFIGMAP=${NAME}-config
NAMESPACE=${1:-"default"}
IMAGE_TAG=$REGISTRY_URL/$GOOGLE_PROJECT_NAME/$NAME:$VERSION
ENV=${NODE_ENV:-"staging"}

echo "Deploying $ENV app [$NAME:$VERSION]..."

# ensure docker is runing
docker info
if [ "$?" -ne "0" ]; then
  exit
fi

# ensure namespace exists
kubectl get namespaces $NAMESPACE -o name

# perform quick tests
npm test

# create config map if not exists
set -o pipefail
kubectl get configmaps $CONFIGMAP --namespace=$NAMESPACE -o name
result=$?
set +o pipefail
case $result in
  0) # configmap exists
  ;;

  1) # configmap not exist - create it
    kubectl create configmap $CONFIGMAP --from-file=config --namespace=$NAMESPACE
  ;;
  *) # unknown error
    exit
esac

# create deployment if not exists
set -o pipefail
kubectl get -f kubernetes/deployment.yml --namespace=$NAMESPACE
result=$?
set +o pipefail
case $result in
  0) # deployment exists
  ;;

  1) # deployment not exist - create it
    kubectl create -f kubernetes/deployment.yml --namespace=$NAMESPACE
    sleep 10
  ;;
  *) # unknown error
    exit
esac

echo "Building image $IMAGE_TAG:"
docker build -t $IMAGE_TAG .
gcloud docker push $IMAGE_TAG
docker rmi $IMAGE_TAG

# update configmap for specified env
echo "Updating configmap:"
config_dir=`mktemp -d`
cp config/default.yml $config_dir/default.yml
cp config/$ENV.yml $config_dir/local.yml
sleep 1
kubectl create configmap $CONFIGMAP --from-file=$config_dir --dry-run -o yaml | kubectl --namespace=$NAMESPACE replace configmap $CONFIGMAP -f -
sleep 3
rm -R $config_dir

echo "Update deployment image:"
kubectl patch --namespace=$NAMESPACE -f kubernetes/deployment.yml -p '{"spec":{"template":{"spec":{"containers":[{"name":"service","image":"'"$IMAGE_TAG"'"}]}}}}'
