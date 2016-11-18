class MockPlugin {
  constructor(davis, options) {
    this.dir = __dirname;
    this.intents = {
      mockIntent: {
        usage: 'Testing Intet',
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
