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
