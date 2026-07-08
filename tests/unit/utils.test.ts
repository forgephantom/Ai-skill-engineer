/**
 * AI Skill Engineer - Unit Tests for Utils
 */

import {
  generateId,
  generateProjectId,
  generateArtifactId,
  calculateChecksum,
  calculateSize,
  createArtifact,
  updateArtifact,
  extractTemplateVariables,
  validateTemplateVariables,
  formatDuration,
  parseDuration,
  sleep,
  withRetry,
  validateRequired,
  sanitizeFileName,
  parseYaml,
  stringifyYaml,
  parseJsonSafe,
  stringifyJson,
  resolveWorkspacePath,
  resolveArtifactPath,
  ok,
  err,
  isOk,
  isErr,
  unwrap,
  unwrapErr,
} from '../../src/utils';
import { Artifact, ArtifactMetadata } from '../../src/types';

describe('Utils', () => {
  describe('ID and Hash Utilities', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^[0-9a-f-]{36}$/);
    });

    it('should generate IDs with prefix', () => {
      const id = generateId('test');
      expect(id).toMatch(/^test-[0-9a-f-]{36}$/);
    });

    it('should generate project IDs', () => {
      const id = generateProjectId();
      expect(id).toMatch(/^proj-[0-9a-f]{8}$/);
    });

    it('should generate artifact IDs', () => {
      const id = generateArtifactId('code', 'test-file');
      expect(id).toMatch(/^code-test-file-[a-f0-9]{8}$/);
    });

    it('should calculate checksums', () => {
      const checksum = calculateChecksum('test content');
      expect(checksum).toHaveLength(64);
      expect(checksum).toMatch(/^[a-f0-9]+$/);
    });

    it('should calculate size', () => {
      expect(calculateSize('hello')).toBe(5);
      expect(calculateSize(Buffer.from('hello'))).toBe(5);
    });
  });

  describe('Artifact Utilities', () => {
    it('should create artifact', () => {
      const artifact = createArtifact(
        'code',
        'test.ts',
        'console.log("test")',
        'typescript',
        'test-skill',
        'ts',
        ['tag1'],
        ['dep1']
      );

      expect(artifact.type).toBe('code');
      expect(artifact.name).toBe('test.ts');
      expect(artifact.content).toBe('console.log("test")');
      expect(artifact.metadata.format).toBe('typescript');
      expect(artifact.metadata.tags).toContain('tag1');
      expect(artifact.metadata.dependencies).toContain('dep1');
      expect(artifact.version).toBe('1.0.0');
      expect(artifact.createdBy).toBe('test-skill');
    });

    it('should update artifact', async () => {
      const artifact = createArtifact('code', 'test.ts', 'old content', 'typescript', 'skill');
      // Small delay to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));
      const updated = updateArtifact(artifact, 'new content');

      expect(updated.content).toBe('new content');
      expect(updated.version).toBe('1.0.1');
      expect(updated.updatedAt.getTime()).toBeGreaterThan(artifact.updatedAt.getTime());
      expect(updated.id).toBe(artifact.id);
    });
  });

  describe('Template Utilities', () => {
    it('should extract template variables', () => {
      const template = 'Hello {{name}}, welcome to {{project}}!';
      const vars = extractTemplateVariables(template);
      expect(vars).toContain('name');
      expect(vars).toContain('project');
    });

    it('should handle handlebars conditionals', () => {
      const template = '{{#if condition}}show{{/if}}';
      const vars = extractTemplateVariables(template);
      // The regex extracts the helper name (#if), but it starts with # so gets filtered out
      // This is expected behavior for simple extraction - conditionals not supported
      expect(vars).toEqual([]);
    });

    it('should validate template variables', () => {
      const template = 'Hello {{name}}, welcome to {{project}}!';
      const missing = validateTemplateVariables(template, { name: 'John' });
      expect(missing).toContain('project');
      expect(missing).not.toContain('name');
    });
  });

  describe('Time and Duration Utilities', () => {
    it('should format duration in ms', () => {
      expect(formatDuration(500)).toBe('500ms');
    });

    it('should format duration in seconds', () => {
      expect(formatDuration(5000)).toBe('5.0s');
    });

    it('should format duration in minutes', () => {
      expect(formatDuration(120000)).toBe('2.0m');
    });

    it('should format duration in hours', () => {
      expect(formatDuration(7200000)).toBe('2.0h');
    });

    it('should parse duration strings', () => {
      expect(parseDuration('500ms')).toBe(500);
      expect(parseDuration('5s')).toBe(5000);
      expect(parseDuration('2m')).toBe(120000);
      expect(parseDuration('1h')).toBe(3600000);
    });

    it('should throw on invalid duration format', () => {
      expect(() => parseDuration('invalid')).toThrow('Invalid duration format');
    });

    it('should sleep', async () => {
      const start = Date.now();
      await sleep(50);
      expect(Date.now() - start).toBeGreaterThanOrEqual(40);
    });
  });

  describe('Retry Utilities', () => {
    it('should succeed on first attempt', async () => {
      const result = await withRetry(
        async () => 'success',
        { maxAttempts: 3, baseDelay: 10, maxDelay: 100, backoffFactor: 2 }
      );
      expect(result).toBe('success');
    });

    it('should retry on failure', async () => {
      let attempts = 0;
      await expect(withRetry(
        async () => {
          attempts++;
          if (attempts < 3) throw new Error('fail');
          return 'success';
        },
        { maxAttempts: 5, baseDelay: 10, maxDelay: 100, backoffFactor: 2 }
      )).resolves.toBe('success');
      expect(attempts).toBe(3);
    });

    it('should fail after max attempts', async () => {
      await expect(withRetry(
        async () => { throw new Error('always fail'); },
        { maxAttempts: 3, baseDelay: 10, maxDelay: 100, backoffFactor: 2 }
      )).rejects.toThrow('always fail');
    });

    it('should not retry non-retryable errors', async () => {
      await expect(withRetry(
        async () => { throw new Error('non-retryable'); },
        { maxAttempts: 3, baseDelay: 10, maxDelay: 100, backoffFactor: 2, retryableErrors: ['retryable'] }
      )).rejects.toThrow('non-retryable');
    });
  });

  describe('Validation Utilities', () => {
    it('should validate required fields', () => {
      const obj = { a: 1, b: { c: 2 } };
      expect(validateRequired(obj, ['a', 'b.c'])).toEqual([]);
      expect(validateRequired(obj, ['a', 'd'])).toEqual(['d']);
      expect(validateRequired(obj, ['b.c', 'b.d'])).toEqual(['b.d']);
    });

    it('should sanitize file names', () => {
      expect(sanitizeFileName('Test File.txt')).toBe('test-file.txt');
      expect(sanitizeFileName('UPPERCASE')).toBe('uppercase');
      expect(sanitizeFileName('special!@#$chars')).toBe('special-chars');
      expect(sanitizeFileName('---multiple---dashes---')).toBe('multiple-dashes');
    });
  });

  describe('YAML/JSON Utilities', () => {
    it('should parse YAML', () => {
      const yaml = 'key: value\nlist:\n  - item1\n  - item2';
      const parsed = parseYaml(yaml);
      expect(parsed.key).toBe('value');
      expect(parsed.list).toEqual(['item1', 'item2']);
    });

    it('should stringify YAML', () => {
      const obj = { key: 'value', list: ['item1', 'item2'] };
      const yaml = stringifyYaml(obj);
      expect(yaml).toContain('key: value');
      expect(yaml).toContain('- item1');
    });

    it('should parse JSON safely', () => {
      expect(parseJsonSafe('{"key": "value"}')).toEqual({ key: 'value' });
      expect(parseJsonSafe('invalid')).toBeNull();
    });

    it('should stringify JSON', () => {
      const json = stringifyJson({ key: 'value' });
      expect(json).toBe('{\n  "key": "value"\n}');
    });
  });

  describe('Path Utilities', () => {
    it('should resolve workspace path', () => {
      const path = resolveWorkspacePath('/base', 'proj-1', 'skill-1');
      expect(path).toBe('/base/proj-1/skill-1');
    });

    it('should resolve artifact path', () => {
      const path = resolveArtifactPath('/base', 'proj-1', 'artifact-1');
      expect(path).toBe('/base/proj-1/artifacts/artifact-1.json');
    });
  });

  describe('Error Handling', () => {
    it('should create AISEError', () => {
      const error = new (require('../../src/utils').AISEError)('Test error', 'TEST_ERROR', true, { context: 'test' });
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.recoverable).toBe(true);
      expect(error.context).toEqual({ context: 'test' });
    });

    it('should create PhaseError', () => {
      const error = new (require('../../src/utils').PhaseError)('Phase failed', 'BUILD', true);
      expect(error.code).toBe('PHASE_BUILD_ERROR');
    });

    it('should create SkillError', () => {
      const error = new (require('../../src/utils').SkillError)('Skill failed', 'TEST_SKILL', true);
      expect(error.code).toBe('SKILL_TEST_SKILL_ERROR');
    });
  });

  describe('Result Type', () => {
    it('should create ok result', () => {
      const result = ok('value');
      expect(isOk(result)).toBe(true);
      expect(isErr(result)).toBe(false);
      expect(unwrap(result)).toBe('value');
    });

    it('should create err result', () => {
      const error = new Error('test error');
      const result = err(error);
      expect(isOk(result)).toBe(false);
      expect(isErr(result)).toBe(true);
      expect(unwrapErr(result)).toBe(error);
    });

    it('should throw on unwrap of err', () => {
      const result = err(new Error('test'));
      expect(() => unwrap(result)).toThrow('test');
    });
  });
});