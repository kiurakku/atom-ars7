/**
 * Монітор продуктивності для Atom
 * Відстежує метрики продуктивності та оптимізує роботу редактора
 */

const { EventEmitter } = require('events');
const { performance } = require('perf_hooks');

class PerformanceMonitor extends EventEmitter {
  constructor() {
    super();
    this.metrics = {
      startupTime: null,
      windowLoadTime: null,
      packageLoadTimes: new Map(),
      memoryUsage: {
        heapUsed: 0,
        heapTotal: 0,
        external: 0
      },
      renderTimes: [],
      fileOpenTimes: []
    };
    this.startTime = performance.now();
    this.observers = [];
  }

  markStartupComplete() {
    this.metrics.startupTime = performance.now() - this.startTime;
    this.emit('startup-complete', this.metrics.startupTime);
  }

  markWindowLoad() {
    this.metrics.windowLoadTime = performance.now() - this.startTime;
    this.emit('window-load', this.metrics.windowLoadTime);
  }

  markPackageLoad(packageName, loadTime) {
    this.metrics.packageLoadTimes.set(packageName, loadTime);
    this.emit('package-load', { packageName, loadTime });
  }

  measureRender(measureName, fn) {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    this.metrics.renderTimes.push({ measureName, duration });
    
    if (duration > 16) { // Більше ніж один кадр (60fps)
      console.warn(`Slow render detected: ${measureName} took ${duration.toFixed(2)}ms`);
      this.emit('slow-render', { measureName, duration });
    }
    
    return result;
  }

  async measureFileOpen(filePath, openFn) {
    const start = performance.now();
    const result = await openFn();
    const duration = performance.now() - start;
    
    this.metrics.fileOpenTimes.push({ filePath, duration });
    
    if (duration > 100) {
      console.warn(`Slow file open: ${filePath} took ${duration.toFixed(2)}ms`);
      this.emit('slow-file-open', { filePath, duration });
    }
    
    return result;
  }

  updateMemoryUsage() {
    if (global.gc) {
      global.gc();
    }
    
    const usage = process.memoryUsage();
    this.metrics.memoryUsage = {
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
      rss: usage.rss
    };
    
    this.emit('memory-update', this.metrics.memoryUsage);
    
    // Попередження про високе використання пам'яті
    if (usage.heapUsed > 500 * 1024 * 1024) { // 500MB
      console.warn(`High memory usage: ${(usage.heapUsed / 1024 / 1024).toFixed(2)}MB`);
      this.emit('high-memory', this.metrics.memoryUsage);
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      uptime: performance.now() - this.startTime,
      currentMemory: process.memoryUsage()
    };
  }

  startMonitoring() {
    // Оновлення метрик пам'яті кожні 5 секунд
    this.memoryInterval = setInterval(() => {
      this.updateMemoryUsage();
    }, 5000);

    // Збір метрик при виході
    process.on('beforeExit', () => {
      this.updateMemoryUsage();
      this.emit('metrics-final', this.getMetrics());
    });
  }

  stopMonitoring() {
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
    }
  }

  // Оптимізація: дебаунс для часті операції
  createDebounced(fn, delay = 100) {
    let timeoutId = null;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  // Оптимізація: throttle для обмеження частоти викликів
  createThrottled(fn, delay = 100) {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return fn(...args);
      }
    };
  }
}

// Singleton instance
let instance = null;

function getPerformanceMonitor() {
  if (!instance) {
    instance = new PerformanceMonitor();
  }
  return instance;
}

module.exports = { PerformanceMonitor, getPerformanceMonitor };
