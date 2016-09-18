### [circleci] create test deployment
warn about insecure

### [circleci] create test deployment
kubectl create namespace staging
kubectl apply -f deployment.yml --namespace=staging

### [circleci] create account for google service
- described here: http://stackoverflow.com/questions/36283660/creating-image-pull-secret-for-google-container-registry-that-doesnt-expire/36286707
- put into variables in circleci under GCLOUD_SERVICE_KEY (project settings -> environment variables)


### [kubernetes] allow pull images from google registry
- create secret
kubectl create secret docker-registry google-docker-registry \
 --docker-server "https://us.gcr.io" \
 --docker-username _json_key \
 --docker-email edissons-admin@spair-api.iam.gserviceaccount.com \
 --docker-password=$(cat /Users/drago/Desktop/edissons-admin-credentials.json)
- add ImagePullSecret to service account (http://kubernetes.io/docs/user-guide/service-accounts/)

### release
npm verison major|minor|path
git push --tags
... whats goin on ...

### build badge
https://circleci.com/docs/status-badges/
[![CircleCI](https://circleci.com/gh/afoninsky/micro-test.svg?style=shield&circle-token=43393d70d9388a7820349593a9702bf480e97d22)](https://circleci.com/gh/afoninsky/micro-test)
