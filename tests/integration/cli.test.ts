/**
 * AI Skill Engineer - Integration Tests for CLI
 */

import { AISECLI } from '../../src/cli';
import * as fs from 'fs-extra';
import * as path from 'path';

describe('CLI Integration', () => {
  const testOutputDir = '/tmp/ai-se-cli-test';

  beforeEach(async () => {
    await fs.remove(testOutputDir);
    await fs.ensureDir(testOutputDir);
  });

  afterEach(async () => {
    await fs.remove(testOutputDir);
  });

  it('should create CLI instance', () => {
    const cli = new AISECLI();
    expect(cli).toBeDefined();
    expect(cli['program']).toBeDefined();
  });

  it('should have all commands registered', () => {
    const cli = new AISECLI();
    const commands = cli['program'].commands.map((c: any) => c.name());
    expect(commands).toContain('init');
    expect(commands).toContain('run');
    expect(commands).toContain('status');
    expect(commands).toContain('resume');
    expect(commands).toContain('stop');
    expect(commands).toContain('validate');
    expect(commands).toContain('skills');
    expect(commands).toContain('templates');
    expect(commands).toContain('config');
    expect(commands).toContain('doctor');
  });

  it('should have init command with correct options', () => {
    const cli = new AISECLI();
    const initCmd = cli['program'].commands.find((c: any) => c.name() === 'init');
    expect(initCmd).toBeDefined();
    const options = initCmd!.options.map((o: any) => o.long);
    expect(options).toContain('--name');
    expect(options).toContain('--output');
    expect(options).toContain('--no-auto-fix');
    expect(options).toContain('--no-human-approval');
    expect(options).toContain('--max-parallel');
    expect(options).toContain('--validation-level');
    expect(options).toContain('--optimization-iterations');
  });

  it('should have run command with correct options', () => {
    const cli = new AISECLI();
    const runCmd = cli['program'].commands.find((c: any) => c.name() === 'run');
    expect(runCmd).toBeDefined();
    const options = runCmd!.options.map((o: any) => o.long);
    expect(options).toContain('--project');
    expect(options).toContain('--phase');
    expect(options).toContain('--resume');
    expect(options).toContain('--no-auto-fix');
    expect(options).toContain('--no-human-approval');
    expect(options).toContain('--max-parallel');
    expect(options).toContain('--timeout');
  });

  it('should have skills subcommands', () => {
    const cli = new AISECLI();
    const skillsCmd = cli['program'].commands.find((c: any) => c.name() === 'skills');
    expect(skillsCmd).toBeDefined();
    const subcommands = skillsCmd!.commands.map((c: any) => c.name());
    expect(subcommands).toContain('list');
    expect(subcommands).toContain('info');
    expect(subcommands).toContain('create');
  });

  it('should have templates subcommands', () => {
    const cli = new AISECLI();
    const templatesCmd = cli['program'].commands.find((c: any) => c.name() === 'templates');
    expect(templatesCmd).toBeDefined();
    const subcommands = templatesCmd!.commands.map((c: any) => c.name());
    expect(subcommands).toContain('list');
    expect(subcommands).toContain('show');
  });

  it('should have config subcommands', () => {
    const cli = new AISECLI();
    const configCmd = cli['program'].commands.find((c: any) => c.name() === 'config');
    expect(configCmd).toBeDefined();
    const subcommands = configCmd!.commands.map((c: any) => c.name());
    expect(subcommands).toContain('show');
    expect(subcommands).toContain('set');
  });
});