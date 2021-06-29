import * as sst from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create a HTTP API
    const api = new sst.Api(this, "Api", {
      defaultAuthorizationType: sst.ApiAuthorizationType.AWS_IAM,
      
      routes: {
        "GET /private": "src/private.handler",
        "GET /public": {
          function: "src/public.handler",
          authorizationType: sst.ApiAuthorizationType.NONE,
        },
      },

    });

    const auth = new sst.Auth(this, "Auth", {
      // Create a Cognito User Pool to manage user's authentication info.
      cognito: {
        userPool: {
          // Users will login using their email or phone number and password
          signInAliases: { email: true, phone: true },
        },
      },
    });

    // Show the endpoint in the output
    this.addOutputs({
      ApiEndpoint: api.url,
      UserPoolId: auth.cognitoUserPool.userPoolId,
      IdentityPoolId: auth.cognitoCfnIdentityPool.ref,
      UserPoolClientId: auth.cognitoUserPoolClient.userPoolClientId,
    });

    // Allow authenticated users to invoke the API
    auth.attachPermissionsForAuthUsers([api]);
  }
}
