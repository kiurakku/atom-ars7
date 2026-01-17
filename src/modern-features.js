/**
 * Сучасні функції для Atom ARS7
 * Включає AI-допомогу, покращене автодоповнення, та інші сучасні можливості
 */

const { EventEmitter } = require('events');

class ModernFeatures extends EventEmitter {
  constructor() {
    super();
    this.features = {
      aiAssist: {
        enabled: false,
        provider: null
      },
      enhancedAutocomplete: {
        enabled: true,
        useLSP: true,
        useFuzzy: true
      },
      codeActions: {
        enabled: true,
        quickFixes: true,
        refactoring: true
      },
      minimap: {
        enabled: true,
        showCodeHighlights: true
      },
      breadcrumbs: {
        enabled: true
      },
      outline: {
        enabled: true
      }
    };
  }

  // AI-допомога (базова інтеграція, можна розширити)
  async getAISuggestion(context) {
    if (!this.features.aiAssist.enabled) {
      return null;
    }

    // Placeholder для майбутньої інтеграції з AI сервісами
    // Можна інтегрувати з OpenAI, GitHub Copilot, тощо
    return null;
  }

  // Покращене автодоповнення з комбінацією LSP та fuzzy search
  async getEnhancedCompletions(editor, bufferPosition) {
    const completions = [];

    // LSP completions
    if (this.features.enhancedAutocomplete.useLSP) {
      const lspCompletions = await this.getLSPCompletions(editor, bufferPosition);
      if (lspCompletions) {
        completions.push(...lspCompletions);
      }
    }

    // Fuzzy completions
    if (this.features.enhancedAutocomplete.useFuzzy) {
      const fuzzyCompletions = await this.getFuzzyCompletions(editor, bufferPosition);
      if (fuzzyCompletions) {
        completions.push(...fuzzyCompletions);
      }
    }

    // Дедуплікація та сортування
    return this.deduplicateAndSort(completions);
  }

  async getLSPCompletions(editor, bufferPosition) {
    // Інтеграція з LanguageServerManager
    const LanguageServerManager = require('./language-server-manager');
    const manager = new LanguageServerManager();
    const grammar = editor.getGrammar();
    const server = manager.getServerForGrammar(grammar);

    if (server) {
      const filePath = editor.getPath();
      return await server.getCompletions(filePath, bufferPosition, {
        triggerKind: 1, // Invoked
        triggerCharacter: null
      });
    }

    return [];
  }

  async getFuzzyCompletions(editor, bufferPosition) {
    // Використання існуючого fuzzy-native
    const { fuzzyNative } = require('@atom/fuzzy-native');
    const buffer = editor.getBuffer();
    const text = buffer.getText();
    const prefix = editor.getTextInBufferRange([
      [bufferPosition.row, 0],
      bufferPosition
    ]).split(/\s+/).pop();

    // Простий пошук слів у документі
    const words = text.match(/\b\w+\b/g) || [];
    const uniqueWords = [...new Set(words)];

    return uniqueWords
      .filter(word => word.startsWith(prefix) && word.length > prefix.length)
      .map(word => ({
        text: word,
        type: 'variable',
        score: 1
      }));
  }

  deduplicateAndSort(completions) {
    const seen = new Set();
    const unique = [];

    for (const item of completions) {
      const key = item.text || item.label || item.insertText;
      if (key && !seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }

    // Сортування за релевантністю
    return unique.sort((a, b) => {
      const scoreA = a.score || 0;
      const scoreB = b.score || 0;
      return scoreB - scoreA;
    });
  }

  // Code Actions (Quick Fixes, Refactoring)
  async getCodeActions(editor, range, diagnostics) {
    if (!this.features.codeActions.enabled) {
      return [];
    }

    const actions = [];

    // Quick fixes
    if (this.features.codeActions.quickFixes) {
      const quickFixes = await this.getQuickFixes(editor, range, diagnostics);
      actions.push(...quickFixes);
    }

    // Refactoring
    if (this.features.codeActions.refactoring) {
      const refactorings = await this.getRefactorings(editor, range);
      actions.push(...refactorings);
    }

    return actions;
  }

  async getQuickFixes(editor, range, diagnostics) {
    // Базові quick fixes
    const fixes = [];

    for (const diagnostic of diagnostics || []) {
      if (diagnostic.code === 'unused-variable') {
        fixes.push({
          title: 'Remove unused variable',
          kind: 'quickfix',
          command: 'remove-unused-variable',
          range: diagnostic.range
        });
      }
    }

    return fixes;
  }

  async getRefactorings(editor, range) {
    const selectedText = editor.getSelectedText();
    const refactorings = [];

    if (selectedText) {
      refactorings.push(
        {
          title: 'Extract to function',
          kind: 'refactor.extract',
          command: 'extract-function'
        },
        {
          title: 'Extract to variable',
          kind: 'refactor.extract',
          command: 'extract-variable'
        },
        {
          title: 'Rename symbol',
          kind: 'refactor.rename',
          command: 'rename-symbol'
        }
      );
    }

    return refactorings;
  }

  // Breadcrumbs для навігації
  getBreadcrumbs(editor, position) {
    if (!this.features.breadcrumbs.enabled) {
      return [];
    }

    const buffer = editor.getBuffer();
    const text = buffer.getTextInRange([[0, 0], position]);
    const lines = text.split('\n');
    const breadcrumbs = [];

    // Простий парсинг для знаходження функцій, класів тощо
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      const functionMatch = line.match(/(?:function|const|let|var)\s+(\w+)/);
      const classMatch = line.match(/class\s+(\w+)/);

      if (functionMatch) {
        breadcrumbs.push({
          name: functionMatch[1],
          type: 'function',
          line: i
        });
      } else if (classMatch) {
        breadcrumbs.push({
          name: classMatch[1],
          type: 'class',
          line: i
        });
      }
    }

    return breadcrumbs.reverse();
  }

  // Outline view
  getOutline(editor) {
    if (!this.features.outline.enabled) {
      return [];
    }

    const buffer = editor.getBuffer();
    const text = buffer.getText();
    const lines = text.split('\n');
    const outline = [];

    lines.forEach((line, index) => {
      const functionMatch = line.match(/(?:function|const|let|var)\s+(\w+)\s*[=:]/);
      const classMatch = line.match(/class\s+(\w+)/);
      const methodMatch = line.match(/(\w+)\s*\(/);

      if (classMatch) {
        outline.push({
          name: classMatch[1],
          type: 'class',
          line: index,
          level: 0
        });
      } else if (functionMatch) {
        outline.push({
          name: functionMatch[1],
          type: 'function',
          line: index,
          level: 1
        });
      } else if (methodMatch && outline.length > 0 && outline[outline.length - 1].type === 'class') {
        outline.push({
          name: methodMatch[1],
          type: 'method',
          line: index,
          level: 2
        });
      }
    });

    return outline;
  }

  configure(feature, config) {
    if (this.features[feature]) {
      this.features[feature] = { ...this.features[feature], ...config };
      this.emit('feature-changed', { feature, config: this.features[feature] });
    }
  }
}

module.exports = ModernFeatures;
