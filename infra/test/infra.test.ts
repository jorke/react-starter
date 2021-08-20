// import * as cdk from '@aws-cdk/core';
import * as cdk from 'aws-cdk-lib';
import * as WebStack from '../lib/web-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new WebStack.WebStack(app, 'MyTestStack');
    // THEN
    const actual = app.synth().getStackArtifact(stack.artifactId).template;
    expect(actual.Resources ?? {}).toEqual({});
});
