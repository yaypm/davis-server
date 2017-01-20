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
        filter: {},
        dynatrace: {},
        slack: {},
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
  
  filterOptions = {
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
