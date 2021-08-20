#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NoServers } from '../lib/web-stack';


class serverlessStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props: cdk.StackProps) {
    super(parent, name, props);
    
    new NoServers(this, 'NoServers', {
      domain: app.node.tryGetContext('domain'), 
      sub: app.node.tryGetContext('sub')
    })
  }
}

const app = new cdk.App();

new serverlessStack(app, 'AmazonMap', {
    env: {
      account: app.node.tryGetContext('accountId'),
      region: 'ap-southeast-2',
  }
});