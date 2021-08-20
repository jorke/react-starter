import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch'

export interface SiteProps {
  domain: string;
  sub: string;
}

export class NoServers extends Construct {
  constructor(scope: cdk.Stack, id: string, props: SiteProps) {
    super(scope, id);

    const { domain, sub } = props;
    const domainName = `${sub}.${domain}`

    const hostedZone = route53.HostedZone.fromLookup(this, 'hostedzone', { domainName: domain })
    const oai = new cloudfront.OriginAccessIdentity(this, 'oai', { comment: `${domainName}`});

    const websiteBucket = new s3.Bucket(this, 'webBucket', {
      bucketName: domainName,
      websiteIndexDocument: 'index.html',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    websiteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:getObject'],
      resources: [websiteBucket.arnForObjects('*')],
      principals: [ new iam.CanonicalUserPrincipal(oai.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }));

    const certificateArn = new acm.DnsValidatedCertificate(this, 'cert', {
      domainName,
      hostedZone,
      region: 'us-east-1',
    }).certificateArn;

    const cf = new cloudfront.CloudFrontWebDistribution(this, 'cf', {
      defaultRootObject: 'index.html',
      viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate({
        certificateArn,
        env: {
          region: cdk.Aws.REGION,
          account: cdk.Aws.ACCOUNT_ID
        },
        node: this.node,
        stack: scope,
        metricDaysToExpiry: () =>
          new cloudwatch.Metric({
            namespace: "TLS Viewer Certificate Validity",
            metricName: "TLS Viewer Certificate Expired",
          }),
      },
        {
          sslMethod: cloudfront.SSLMethod.SNI,
          securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
          aliases: [domainName]
        }),
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: websiteBucket,
            originAccessIdentity: oai
          },
          behaviors: [{
            isDefaultBehavior: true,
            compress: true,
            allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
          }],
        }
      ]
    });

    new route53.ARecord(this, 'SiteAliasRecord', {
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(cf)),
      zone: hostedZone,
    });
  
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('../dist')],
      destinationBucket: websiteBucket,
      // destinationKeyPrefix: 'web/'
    });

    const outDomain = new cdk.CfnOutput(this, 'url', {
      value: domainName,
      exportName: 'url'
    });
  

  }
}
