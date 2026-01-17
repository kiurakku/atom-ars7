/**
 * Менеджер Language Server Protocol серверів
 * Керує життєвим циклом LSP серверів для різних мов
 */

const LanguageServerClient = require('./language-server-client');
const path = require('path');
const { EventEmitter } = require('events');

class LanguageServerManager extends EventEmitter {
  constructor() {
    super();
    this.servers = new Map();
    this.config = {
      // Конфігурація LSP серверів для різних мов
      servers: {
        'source.javascript': {
          command: 'node',
          args: [path.join(__dirname, '..', 'node_modules', 'typescript-language-server', 'lib', 'cli.js'), '--stdio'],
          enabled: false // Потрібно встановити typescript-language-server
        },
        'source.python': {
          command: 'pylsp',
          args: [],
          enabled: false // Потрібно встановити python-lsp-server
        },
        'source.go': {
          command: 'gopls',
          args: [],
          enabled: false // Потрібно встановити gopls
        }
      }
    };
  }

  getServerForGrammar(grammar) {
    if (!grammar || !grammar.scopeName) {
      return null;
    }

    const scopeName = grammar.scopeName;
    for (const [key, config] of Object.entries(this.config.servers)) {
      if (scopeName.startsWith(key) && config.enabled) {
        if (!this.servers.has(key)) {
          this.startServer(key, config);
        }
        return this.servers.get(key);
      }
    }

    return null;
  }

  startServer(key, config) {
    if (this.servers.has(key)) {
      return this.servers.get(key);
    }

    const client = new LanguageServerClient(config.command, config.args, config.options);
    
    client.on('error', (error) => {
      console.error(`LSP server error for ${key}:`, error);
      this.emit('server-error', { key, error });
    });

    client.on('exit', (code) => {
      console.log(`LSP server exited for ${key} with code ${code}`);
      this.servers.delete(key);
      this.emit('server-exit', { key, code });
    });

    this.servers.set(key, client);
    return client;
  }

  stopServer(key) {
    const client = this.servers.get(key);
    if (client) {
      client.stop();
      this.servers.delete(key);
    }
  }

  stopAll() {
    for (const [key, client] of this.servers.entries()) {
      client.stop();
    }
    this.servers.clear();
  }

  async initializeServer(key, workspaceRoot) {
    const client = this.servers.get(key);
    if (client && !client.initialized) {
      await client.start(workspaceRoot);
    }
  }

  configureServer(key, config) {
    if (this.config.servers[key]) {
      this.config.servers[key] = { ...this.config.servers[key], ...config };
    } else {
      this.config.servers[key] = config;
    }
  }
}

module.exports = LanguageServerManager;
