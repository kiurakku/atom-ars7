/**
 * Language Server Protocol (LSP) Client для Atom
 * Забезпечує інтеграцію з LSP серверами для кращого автодоповнення та аналізу коду
 */

const { EventEmitter } = require('events');
const { spawn } = require('child_process');
const path = require('path');

class LanguageServerClient extends EventEmitter {
  constructor(serverCommand, serverArgs = [], options = {}) {
    super();
    this.serverCommand = serverCommand;
    this.serverArgs = serverArgs;
    this.options = options;
    this.process = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
    this.initialized = false;
  }

  start(workspaceRoot) {
    if (this.process) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const options = {
        cwd: workspaceRoot || process.cwd(),
        env: { ...process.env, ...this.options.env }
      };

      this.process = spawn(this.serverCommand, this.serverArgs, options);

      let outputBuffer = '';
      let errorBuffer = '';

      this.process.stdout.on('data', (data) => {
        outputBuffer += data.toString();
        this.processMessages(outputBuffer);
      });

      this.process.stderr.on('data', (data) => {
        errorBuffer += data.toString();
        this.emit('error', new Error(errorBuffer));
      });

      this.process.on('error', (error) => {
        this.emit('error', error);
        reject(error);
      });

      this.process.on('exit', (code) => {
        this.process = null;
        this.initialized = false;
        this.emit('exit', code);
      });

      // Ініціалізація LSP
      this.initialize(workspaceRoot).then(() => {
        this.initialized = true;
        resolve();
      }).catch(reject);
    });
  }

  processMessages(buffer) {
    const contentLengthMatch = buffer.match(/Content-Length: (\d+)/);
    if (!contentLengthMatch) return;

    const contentLength = parseInt(contentLengthMatch[1], 10);
    const headerEnd = buffer.indexOf('\r\n\r\n');
    if (headerEnd === -1) return;

    const messageStart = headerEnd + 4;
    const messageEnd = messageStart + contentLength;

    if (buffer.length < messageEnd) return;

    const messageJson = buffer.substring(messageStart, messageEnd);
    const remaining = buffer.substring(messageEnd);

    try {
      const message = JSON.parse(messageJson);
      this.handleMessage(message);
      this.processMessages(remaining);
    } catch (error) {
      console.error('Failed to parse LSP message:', error);
      this.processMessages(remaining);
    }
  }

  handleMessage(message) {
    if (message.id && this.pendingRequests.has(message.id)) {
      const { resolve, reject } = this.pendingRequests.get(message.id);
      this.pendingRequests.delete(message.id);

      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result);
      }
    } else if (message.method) {
      this.emit('notification', message);
    }
  }

  sendRequest(method, params) {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      const message = {
        jsonrpc: '2.0',
        id,
        method,
        params
      };

      this.pendingRequests.set(id, { resolve, reject });
      this.sendMessage(message);
    });
  }

  sendNotification(method, params) {
    const message = {
      jsonrpc: '2.0',
      method,
      params
    };
    this.sendMessage(message);
  }

  sendMessage(message) {
    if (!this.process || !this.process.stdin) {
      return;
    }

    const messageJson = JSON.stringify(message);
    const contentLength = Buffer.byteLength(messageJson, 'utf8');
    const header = `Content-Length: ${contentLength}\r\n\r\n`;
    const fullMessage = header + messageJson;

    this.process.stdin.write(fullMessage, 'utf8');
  }

  async initialize(workspaceRoot) {
    const result = await this.sendRequest('initialize', {
      processId: process.pid,
      rootPath: workspaceRoot,
      rootUri: `file://${workspaceRoot}`,
      capabilities: {
        textDocument: {
          completion: { completionItem: { snippetSupport: true } },
          hover: { contentFormat: ['markdown', 'plaintext'] },
          signatureHelp: { signatureInformation: { documentationFormat: ['markdown'] } },
          definition: {},
          references: {},
          documentSymbol: {},
          formatting: {},
          rangeFormatting: {},
          codeAction: {}
        },
        workspace: {
          symbol: {},
          configuration: true
        }
      }
    });

    await this.sendNotification('initialized');
    return result;
  }

  async getCompletions(filePath, position, context) {
    if (!this.initialized) {
      return [];
    }

    try {
      const result = await this.sendRequest('textDocument/completion', {
        textDocument: { uri: `file://${filePath}` },
        position: { line: position.row, character: position.column },
        context
      });

      if (Array.isArray(result)) {
        return result;
      } else if (result && result.items) {
        return result.items;
      }
      return [];
    } catch (error) {
      console.error('LSP completion error:', error);
      return [];
    }
  }

  async getHover(filePath, position) {
    if (!this.initialized) {
      return null;
    }

    try {
      const result = await this.sendRequest('textDocument/hover', {
        textDocument: { uri: `file://${filePath}` },
        position: { line: position.row, character: position.column }
      });

      return result;
    } catch (error) {
      console.error('LSP hover error:', error);
      return null;
    }
  }

  async getDefinition(filePath, position) {
    if (!this.initialized) {
      return null;
    }

    try {
      const result = await this.sendRequest('textDocument/definition', {
        textDocument: { uri: `file://${filePath}` },
        position: { line: position.row, character: position.column }
      });

      return result;
    } catch (error) {
      console.error('LSP definition error:', error);
      return null;
    }
  }

  stop() {
    if (this.process) {
      this.sendNotification('shutdown');
      setTimeout(() => {
        if (this.process) {
          this.process.kill();
          this.process = null;
        }
      }, 1000);
    }
    this.initialized = false;
  }
}

module.exports = LanguageServerClient;
