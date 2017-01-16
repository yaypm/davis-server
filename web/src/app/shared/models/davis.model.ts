export class DavisModel {
  
  user: any = {
    email: '',
    password: '',
    timezone: '',
    alexa_ids: '',
    name: {
        first: '',
        last: '',
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
        email: '',
        password: '',
      },
      user: this.user,
    }
  };
  
  config: any = {
    values: {
      otherUser: this.user,
      users: [],
      dynatrace: {
        url: '',
        apiUrl: '',
        token: '',
        strictSSL: true,
      },
      slack: {
        enabled: true,
        clientId: '',
        clientSecret: '',
        redirectUri: '',
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