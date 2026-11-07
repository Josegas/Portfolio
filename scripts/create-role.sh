#!/usr/bin/env bash
# Creates the Lambda execution role. Run once, with an identity allowed to
# write IAM. The day-to-day deploy profile deliberately cannot do this.
set -euo pipefail

ACCOUNT="$(aws sts get-caller-identity --query Account --output text)"
REGION=us-east-1
ROLE=portfolio-api-role

TRUST='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole","Condition":{"StringEquals":{"aws:SourceAccount":"'"$ACCOUNT"'"}}}]}'
POLICY='{"Version":"2012-10-17","Statement":[
{"Sid":"OneTableOnly","Effect":"Allow","Action":["dynamodb:GetItem","dynamodb:PutItem","dynamodb:UpdateItem","dynamodb:DeleteItem","dynamodb:Query"],"Resource":"arn:aws:dynamodb:'"$REGION"':'"$ACCOUNT"':table/portfolio-drops"},
{"Sid":"OwnLogsOnly","Effect":"Allow","Action":["logs:CreateLogGroup","logs:CreateLogStream","logs:PutLogEvents"],"Resource":"arn:aws:logs:'"$REGION"':'"$ACCOUNT"':log-group:/aws/lambda/portfolio-api:*"}
]}'

aws iam get-role --role-name "$ROLE" >/dev/null 2>&1 || \
  aws iam create-role --role-name "$ROLE" --assume-role-policy-document "$TRUST" \
    --tags Key=project,Value=portfolio --query Role.Arn --output text
aws iam put-role-policy --role-name "$ROLE" --policy-name portfolio-api-policy --policy-document "$POLICY"
echo "role ready: $ROLE"
