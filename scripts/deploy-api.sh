#!/usr/bin/env bash
# Creates or updates the API: DynamoDB table, Lambda and HTTP API.
#
#   AWS_PROFILE=portfolio bash scripts/deploy-api.sh
#
# Idempotent. The Lambda role must already exist, because this profile
# has no IAM write access on purpose (see scripts/create-role.sh).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REGION=us-east-1
TABLE=portfolio-drops
FUNCTION=portfolio-api
API_NAME=portfolio-api
ACCOUNT="$(aws sts get-caller-identity --query Account --output text)"
ROLE_ARN="arn:aws:iam::$ACCOUNT:role/portfolio-api-role"
TOKEN="$(tr -d '[:space:]' < "$ROOT/.secrets/sensor-token.txt")"
ORIGIN="${ALLOWED_ORIGIN:-*}"
ENV_VARS="Variables={TABLE=$TABLE,BUCKET=portfolio-drops-$ACCOUNT,PHONE_TOKEN=$TOKEN,ALLOWED_ORIGIN=$ORIGIN}"

echo "== table"
if ! aws dynamodb describe-table --table-name "$TABLE" --region "$REGION" >/dev/null 2>&1; then
  aws dynamodb create-table --table-name "$TABLE" --region "$REGION" \
    --attribute-definitions AttributeName=pk,AttributeType=S AttributeName=sk,AttributeType=S \
    --key-schema AttributeName=pk,KeyType=HASH AttributeName=sk,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --tags Key=project,Value=portfolio >/dev/null
  aws dynamodb wait table-exists --table-name "$TABLE" --region "$REGION"
fi

echo "== function"
BUILD="$(mktemp -d)"
trap 'rm -rf "$BUILD"' EXIT
( cd "$ROOT/lambda" && zip -q -j "$BUILD/api.zip" index.mjs )
if aws lambda get-function --function-name "$FUNCTION" --region "$REGION" >/dev/null 2>&1; then
  aws lambda update-function-code --function-name "$FUNCTION" --region "$REGION" \
    --zip-file "fileb://$BUILD/api.zip" --query LastModified --output text
  aws lambda wait function-updated-v2 --function-name "$FUNCTION" --region "$REGION"
  aws lambda update-function-configuration --function-name "$FUNCTION" --region "$REGION" \
    --environment "$ENV_VARS" --query LastUpdateStatus --output text
  aws lambda wait function-updated-v2 --function-name "$FUNCTION" --region "$REGION"
else
  aws lambda create-function --function-name "$FUNCTION" --region "$REGION" \
    --runtime nodejs22.x --architectures arm64 --handler index.handler \
    --memory-size 256 --timeout 10 \
    --role "$ROLE_ARN" --zip-file "fileb://$BUILD/api.zip" \
    --environment "$ENV_VARS" \
    --tags project=portfolio --query FunctionArn --output text
  aws lambda wait function-active-v2 --function-name "$FUNCTION" --region "$REGION"
  aws logs put-retention-policy --log-group-name "/aws/lambda/$FUNCTION" \
    --retention-in-days 30 --region "$REGION" 2>/dev/null || true
fi

echo "== api"
API_ID="$(aws apigatewayv2 get-apis --region "$REGION" \
  --query "Items[?Name=='$API_NAME'].ApiId | [0]" --output text)"
FUNCTION_ARN="arn:aws:lambda:$REGION:$ACCOUNT:function:$FUNCTION"
if [ "$API_ID" = "None" ] || [ -z "$API_ID" ]; then
  API_ID="$(aws apigatewayv2 create-api --name "$API_NAME" --protocol-type HTTP \
    --region "$REGION" --tags project=portfolio --query ApiId --output text)"
  INTEGRATION="$(aws apigatewayv2 create-integration --api-id "$API_ID" --region "$REGION" \
    --integration-type AWS_PROXY --integration-uri "$FUNCTION_ARN" \
    --payload-format-version 2.0 --query IntegrationId --output text)"
  aws apigatewayv2 create-route --api-id "$API_ID" --region "$REGION" \
    --route-key '$default' --target "integrations/$INTEGRATION" >/dev/null
  aws apigatewayv2 create-stage --api-id "$API_ID" --region "$REGION" \
    --stage-name '$default' --auto-deploy \
    --default-route-settings ThrottlingRateLimit=20,ThrottlingBurstLimit=40 >/dev/null
  aws lambda add-permission --function-name "$FUNCTION" --region "$REGION" \
    --statement-id apigateway-invoke --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT:$API_ID/*" >/dev/null
fi

echo "== done"
echo "https://$API_ID.execute-api.$REGION.amazonaws.com"
