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
  
  filters: any = {
    name: '',
    owner: '',
    description: '',
    enabled: true,
    scope: '',
    origin: '',
    status: [],
    impact: [],
    severityLevel: [],
    entityID: [],
    excludeEventType: [],
    tags: {
      includes: [],
      excludes: [],
    },
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
      filters: this.filters,
      dynatrace: {
        url: '',
        apiUrl: '',
        token: '',
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
        filters: {},
        dynatrace: {},
        slack: {},
      },
    },
    status: {
      user: this.status,
      users: this.status,
      filters: this.status,
      dynatrace: this.status,
      alexa: this.status,
      slack: this.status,
    },
  };
}