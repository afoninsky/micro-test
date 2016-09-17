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



# -----

1) https://circleci.com/docs/status-badges/

2) put coverage into build, something like:
mkdir -p $CIRCLE_ARTIFACTS/coverage
docker run -v $CIRCLE_ARTIFACTS/coverage:/usr/src/app/coverage test npm test && ./node_modules/.bin/nyc report --reporter clover

3) request build remotely
curl \
  --header "Content-Type: application/json" \
  --data '{"build_parameters": {"param1": "value1", "param2": 500}}' \
  --request POST \
  https://circleci.com/api/v1/project/circleci/mongofinil/tree/master?circle-token=$CIRCLE_TOKEN

export param1="value1"
export param2="500"
