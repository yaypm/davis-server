export class DavisModel {
  
  user: any = {
    email: null,
    password: null,
    timezone: null,
    alexa_ids: null,
    name: {
        first: null,
        last: null,
    },
    admin: false,
  };
  
  status: any = {
    error: null,
    success: null
  };
  
  davis: any = {
    values: {
      authenticate: {
        email: null,
        password: null,
      },
      user: this.user,
    }
  };
  
  config: any = {
    values: {
      otherUser: this.user,
      users: [],
      dynatrace: {
        url: null,
        token: null,
        strictSSL: true,
      },
      slack: {
        enabled: true,
        clientId: null,
        clientSecret: null,
        redirectUri: null,
      },
      original: {
        user: {},
        otherUser: {},
        dynatrace: {},
        slack: {},
      },
    },
    status: {
      user: this.status,
      users: this.status,
      dynatrace: this.status,
      alexa: this.status,
      slack: this.status,
    },
  };
}