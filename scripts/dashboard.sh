#!/usr/bin/env bash
# CloudWatch dashboard and error alarm for the sky API.
set -euo pipefail
REGION=us-east-1
BODY='{"widgets":[
{"type":"metric","x":0,"y":0,"width":8,"height":6,"properties":{"title":"Drops let go and landed","region":"us-east-1","stat":"Sum","period":3600,"view":"timeSeries","metrics":[["Portfolio/Sky","DropCreated"],["Portfolio/Sky","DropLanded",{"stat":"SampleCount"}]]}},
{"type":"metric","x":8,"y":0,"width":8,"height":6,"properties":{"title":"Time for a drop to reach the phone (ms)","region":"us-east-1","stat":"Average","period":3600,"view":"timeSeries","metrics":[["Portfolio/Sky","DropLanded"]]}},
{"type":"metric","x":16,"y":0,"width":8,"height":6,"properties":{"title":"Phone heartbeats","region":"us-east-1","stat":"Sum","period":300,"view":"timeSeries","metrics":[["Portfolio/Sky","PhoneBeat"]]}},
{"type":"metric","x":0,"y":6,"width":12,"height":6,"properties":{"title":"Lambda duration (ms)","region":"us-east-1","stat":"Average","period":300,"view":"timeSeries","metrics":[["AWS/Lambda","Duration","FunctionName","portfolio-api"]]}},
{"type":"metric","x":12,"y":6,"width":12,"height":6,"properties":{"title":"API errors","region":"us-east-1","stat":"Sum","period":300,"view":"timeSeries","metrics":[["Portfolio/Sky","ApiError"],["AWS/Lambda","Errors","FunctionName","portfolio-api"]]}}
]}'
aws cloudwatch put-dashboard --region "$REGION" --dashboard-name portfolio-sky --dashboard-body "$BODY" --query DashboardValidationMessages --output text
aws cloudwatch put-metric-alarm --region "$REGION" --alarm-name portfolio-api-errors \
  --namespace AWS/Lambda --metric-name Errors --dimensions Name=FunctionName,Value=portfolio-api \
  --statistic Sum --period 300 --evaluation-periods 1 --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold --treat-missing-data notBreaching
echo "dashboard and alarm ready"
