export class DavisModel {

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
    entityID: [],
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
      filter: this.filter,
      dynatrace: this.dynatrace,
      slack: this.slack,
      channels: [],
      original: {
        user: this.user,
        otherUser: this.user,
        filter: this.filter,
        dynatrace: this.dynatrace,
        slack: this.slack,
      },
    },
    status: {
      user: this.status,
      users: this.status,
      filter: this.status,
      filters: this.status,
      dynatrace: this.status,
      alexa: this.status,
      slack: this.status,
    },
  };   
  
  filterScope: any = {
    source: 'global',
    team_id: null,
    channel_id: null,
    email: null,
  };
  
  filterScopes: any = {
    sources: [
      {
        text: 'All',
        value: 'global',
      }, 
      {
        text: 'Web',
        value: 'web',
      }, 
      {
        text: 'Slack',
        value: 'slack',
      },
    ],
    teams: {},
    teams_array: [],
    channels: [],
    users: [],
  };
  
  filterOptions: any = {
    status: [
      {
        text: 'Open',
        value: 'OPEN',
        enabled: false,
      }, 
      {
        text: 'Closed',
        value: 'CLOSED',
        enabled: false,
      },
    ],
    impact: [
      {
        text: 'Application',
        value: 'APPLICATION',
        enabled: false,
      }, 
      {
        text: 'Service',
        value: 'SERVICE',
        enabled: false,
      },
      {
        text: 'Infrastructure',
        value: 'INFRASTRUCTURE',
        enabled: false,
      },
    ],
    severityLevel: [
      {
        text: 'Availability',
        value: 'AVAILABILITY',
        enabled: false,
      }, 
      {
        text: 'Error',
        value: 'ERROR',
        enabled: false,
      },
      {
        text: 'Performance',
        value: 'PERFORMANCE',
        enabled: false,
      },
      {
        text: 'Resource Contention',
        value: 'RESOURCE_CONTENTION',
        enabled: false,
      },
      {
        text: 'Custom Alert',
        value: 'CUSTOM_ALERT',
        enabled: false,
      },
    ],
    origin: [
      {
        text: 'All',
        value: 'ALL',
      }, 
      {
        text: 'Notification',
        value: 'NOTIFICATION',
      }, 
      {
        text: 'Question',
        value: 'QUESTION',
      },
    ],
  };
}
