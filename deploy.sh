#!/bin/bash -xe

aws s3 cp --acl public-read ./node_modules/orbs-client-sdk/dist/orbs-client-sdk.js s3://orbs-experimental/conversation/node_modules/orbs-client-sdk/dist/orbs-client-sdk.js

aws s3 cp --acl public-read index.js s3://orbs-experimental/conversation/index.js

aws s3 cp --acl public-read app.js s3://orbs-experimental/conversation/app.js

aws s3 cp --acl public-read index.html s3://orbs-experimental/conversation/index.html
