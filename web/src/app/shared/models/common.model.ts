export class CommonModel {
  user: any = {
    email: '',
    password: '',
    timezone: '',
    alexa_ids: [],
    name: {
      first: '',
      last: '',
    },
    admin: false,
    owner: '',
    demo: true,
  };

  filter: any = {
    name: '',
    owner: '',
    description: '',
    enabled: true,
    scope: '',
    origin: '',
    status: [],
    impact: [],
    severityLevel: [],
    entity: [],
    entityTags: [],
    excludeEventType: [],
    tags: {
      includes: [],
      excludes: [],
    },
  };
  
  dynatrace: any = {
    url: '',
    apiUrl: '',
    token: '',
    strictSSL: true,
  };
  
  notifications: any = {
    uri: '',
    config: '',
  };
  
  slack: any = {
    enabled: true,
    clientId: '',
    clientSecret: '',
    redirectUri: '',
  };

  status: any = {
    error: null,
    success: null
  };
}