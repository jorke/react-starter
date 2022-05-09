import { Signer } from "@aws-amplify/core"

export const createRequestTransformer = async ({ credentials, region, }) => {
    return (url, resourceType) => {
      if (resourceType === "Style" && !url.includes("://")) {
        // resolve to an AWS URL
        url = `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
      }
      if (url.includes("amazonaws.com")) {
        return {
          // @aws-sdk/signature-v4 would be another option, but this needs to be synchronous
          url: Signer.signUrl(url, {
            access_key: credentials.accessKeyId,
            secret_key: credentials.secretAccessKey,
            session_token: credentials.sessionToken,
          }),
        }
      }
      // don't sign
      return { url };  
  
    }
  }

