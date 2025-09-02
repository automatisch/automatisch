import EngineClass from './src/engine/engine-class.js';

console.log('Engine class loaded successfully');
const engine = new EngineClass();
console.log('Engine instance created');
console.log('Engine methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(engine)).filter(m => m !== 'constructor'));
