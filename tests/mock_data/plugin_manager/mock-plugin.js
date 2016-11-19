class MockPlugin {
  constructor(davis, options) {
    this.intents = {
      mockIntent: {
        usage: 'Testing Intent',
        phrases: [
          'test',
        ],
        lifecycleEvents: [
          'test',
        ],
      },
    };

    this.hooks = {
      'mockIntent:test': exchange => {
        exchange.tested = true;
        exchange.response('hi').end();
      }
    }
  } 
}

module.exports = MockPlugin;
