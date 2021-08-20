import { Construct } from 'constructs';
import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cognito from "aws-cdk-lib/aws-cognito";

export default class CognitoUnAuthRole extends Construct {

  role: iam.Role;

  constructor(scope: Construct, id: string, props?: any) {
    super(scope, id);

    const { identityPool, mapArns } = props;

    // IAM role used for unauthenticated users
    this.role = new iam.Role(this, "CognitoUnAuthenticatedRole", {
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "unauthenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });
    this.role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "mobileanalytics:PutEvents",
          "cognito-sync:*",
          // "cognito-identity:*",
        ],
        resources: ["*"],
      }),      
    );

    this.role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "geo:GetMapStyleDescriptor",
          "geo:GetMapGlyphs",
          "geo:GetMapSprites",
          "geo:GetMapTile",
        ],
        resources: mapArns
      })
    )

    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      "IdentityPoolRoleAttachment",
      {
        identityPoolId: identityPool.ref,
        roles: { unauthenticated: this.role.roleArn },
      }
    );
  }
}