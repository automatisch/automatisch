import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import App from '@/models/app.js';
import * as getAppModule from '@/helpers/get-app.js';
import * as appInfoConverterModule from '@/helpers/app-info-converter.js';
import * as licenseModule from '@/helpers/license.ee.js';

describe('App model', () => {
  it('folderPath should return correct path', () => {
    expect(App.folderPath.endsWith('/packages/backend/src/apps')).toBe(true);
  });

  it('privatePath should return correct path', () => {
    expect(
      App.privatePath.endsWith('/packages/backend/src/private-apps')
    ).toBe(true);
  });

  describe('list', () => {
    it('should list all applications including enterprise ones when license is valid', async () => {
      const originalExistsSync = fs.existsSync;
      const mockExistsSync = vi.spyOn(fs, 'existsSync');

      mockExistsSync.mockImplementation((path) => {
        if (path.endsWith('private-apps')) {
          return false; // Private apps directory doesn't exist (like CI)
        }

        return originalExistsSync.call(fs, path);
      });

      vi.spyOn(licenseModule, 'hasValidLicense').mockResolvedValue(true);

      const appList = await App.list();

      expect(appList).toMatchSnapshot();
      expect(appList).toContain('forms');
    });

    it('should exclude enterprise apps when license is not valid', async () => {
      const originalExistsSync = fs.existsSync;
      const mockExistsSync = vi.spyOn(fs, 'existsSync');

      mockExistsSync.mockImplementation((path) => {
        if (path.endsWith('private-apps')) {
          return false; // Private apps directory doesn't exist (like CI)
        }

        return originalExistsSync.call(fs, path);
      });

      vi.spyOn(licenseModule, 'hasValidLicense').mockResolvedValue(false);

      const appList = await App.list();

      expect(appList).toMatchSnapshot();
      expect(appList).not.toContain('forms');
    });

    describe('directory filtering', () => {
      it('should only include directories with index.js or index.ee.js', async () => {
        const mockReaddirSync = vi.spyOn(fs, 'readdirSync');
        const mockStatSync = vi.spyOn(fs, 'statSync');
        const mockExistsSync = vi.spyOn(fs, 'existsSync');

        // Mock main apps directory contents
        mockReaddirSync.mockReturnValueOnce([
          'valid-app',
          'incomplete-app',
          '.git',
          'README.md',
          'enterprise-app',
        ]);

        // Mock private apps directory doesn't exist
        mockExistsSync.mockImplementation((path) => {
          if (path.includes('private-apps')) return false;
          if (path.includes('valid-app/index.js')) return true;
          if (path.includes('enterprise-app/index.ee.js')) return true;
          if (path.includes('incomplete-app/index.js')) return false;
          return false;
        });

        // Mock statSync for directory checking
        mockStatSync.mockImplementation((path) => ({
          isDirectory: () => !path.includes('README.md'),
        }));

        vi.spyOn(licenseModule, 'hasValidLicense').mockResolvedValue(true);

        const appList = await App.list();

        expect(appList).toEqual(['enterprise-app', 'valid-app']);
        expect(appList).not.toContain('.git');
        expect(appList).not.toContain('README.md');
        expect(appList).not.toContain('incomplete-app');
      });

      it('should exclude files and only process directories', async () => {
        const mockReaddirSync = vi.spyOn(fs, 'readdirSync');
        const mockStatSync = vi.spyOn(fs, 'statSync');
        const mockExistsSync = vi.spyOn(fs, 'existsSync');

        mockReaddirSync.mockReturnValueOnce(['app1', 'file.txt', 'app2']);
        mockExistsSync.mockImplementation((path) => {
          if (path.includes('private-apps')) return false;
          if (path.includes('app1/index.js')) return true;
          if (path.includes('app2/index.js')) return true;
          return false;
        });

        mockStatSync.mockImplementation((path) => ({
          isDirectory: () => !path.includes('file.txt'),
        }));

        vi.spyOn(licenseModule, 'hasValidLicense').mockResolvedValue(true);

        const appList = await App.list();

        expect(appList).toEqual(['app1', 'app2']);
        expect(appList).not.toContain('file.txt');
      });
    });

    describe('private apps integration', () => {
      it('should include private apps when they exist', async () => {
        const mockReaddirSync = vi.spyOn(fs, 'readdirSync');
        const mockStatSync = vi.spyOn(fs, 'statSync');
        const mockExistsSync = vi.spyOn(fs, 'existsSync');

        // Mock main apps directory
        mockReaddirSync.mockImplementation((path) => {
          if (path.includes('/apps') && !path.includes('private-apps'))
            return ['deepl'];
          if (path.includes('private-apps')) return ['private-app'];
          return [];
        });

        // Mock private directory exists and apps have index files
        mockExistsSync.mockImplementation((path) => {
          if (path.includes('private-apps') && !path.includes('index'))
            return true;
          if (path.includes('deepl/index.js')) return true;
          if (path.includes('private-app/index.js')) return true;
          return false;
        });

        mockStatSync.mockImplementation(() => ({
          isDirectory: () => true,
        }));

        vi.spyOn(licenseModule, 'hasValidLicense').mockResolvedValue(true);

        const appList = await App.list();

        expect(appList).toContain('deepl');
        expect(appList).toContain('private-app');
      });

      it('should handle missing private apps directory gracefully', async () => {
        const mockReaddirSync = vi.spyOn(fs, 'readdirSync');
        const mockStatSync = vi.spyOn(fs, 'statSync');
        const mockExistsSync = vi.spyOn(fs, 'existsSync');

        // Mock main apps directory only
        mockReaddirSync.mockImplementation((path) => {
          if (path.includes('/apps') && !path.includes('private-apps'))
            return ['deepl'];
          throw new Error('ENOENT: no such file or directory');
        });

        mockExistsSync.mockImplementation((path) => {
          if (path.includes('private-apps') && !path.includes('index'))
            return false;
          if (path.includes('deepl/index.js')) return true;
          return false;
        });

        mockStatSync.mockImplementation(() => ({
          isDirectory: () => true,
        }));

        vi.spyOn(licenseModule, 'hasValidLicense').mockResolvedValue(true);

        const appList = await App.list();

        expect(appList).toEqual(['deepl']);
      });
    });

    describe('license filtering with private apps', () => {
      it('should include private enterprise apps when license is valid', async () => {
        const mockReaddirSync = vi.spyOn(fs, 'readdirSync');
        const mockStatSync = vi.spyOn(fs, 'statSync');
        const mockExistsSync = vi.spyOn(fs, 'existsSync');

        mockReaddirSync.mockImplementation((path) => {
          if (path.includes('/apps') && !path.includes('private-apps'))
            return ['deepl'];
          if (path.includes('private-apps')) return ['forms'];
          return [];
        });

        mockExistsSync.mockImplementation((path) => {
          if (path.includes('private-apps') && !path.includes('index'))
            return true;
          if (path.includes('deepl/index.js')) return true;
          if (path.includes('forms/index.ee.js')) return true;
          return false;
        });

        mockStatSync.mockImplementation(() => ({
          isDirectory: () => true,
        }));

        vi.spyOn(licenseModule, 'hasValidLicense').mockResolvedValue(true);

        const appList = await App.list();

        expect(appList).toContain('forms');
        expect(appList).toContain('deepl');
      });

      it('should exclude private enterprise apps when license is invalid', async () => {
        const mockReaddirSync = vi.spyOn(fs, 'readdirSync');
        const mockStatSync = vi.spyOn(fs, 'statSync');
        const mockExistsSync = vi.spyOn(fs, 'existsSync');

        mockReaddirSync.mockImplementation((path) => {
          if (path.includes('/apps') && !path.includes('private-apps'))
            return ['deepl'];
          if (path.includes('private-apps')) return ['forms', 'webhook'];
          return [];
        });

        mockExistsSync.mockImplementation((path) => {
          if (path.includes('private-apps') && !path.includes('index'))
            return true;
          if (path.includes('deepl/index.js')) return true;
          if (path.includes('forms/index.ee.js')) return true;
          if (path.includes('webhook/index.js')) return true;
          return false;
        });

        mockStatSync.mockImplementation(() => ({
          isDirectory: () => true,
        }));

        vi.spyOn(licenseModule, 'hasValidLicense').mockResolvedValue(false);

        const appList = await App.list();

        expect(appList).not.toContain('forms');
        expect(appList).toContain('webhook');
        expect(appList).toContain('deepl');
      });
    });

    describe('sorting behavior', () => {
      it('should return apps in alphabetical order', async () => {
        const mockReaddirSync = vi.spyOn(fs, 'readdirSync');
        const mockStatSync = vi.spyOn(fs, 'statSync');
        const mockExistsSync = vi.spyOn(fs, 'existsSync');

        mockReaddirSync.mockImplementation((path) => {
          if (path.includes('/apps') && !path.includes('private-apps'))
            return ['webhooks', 'airtable', 'github'];
          if (path.includes('private-apps')) return ['deepl'];
          return [];
        });

        mockExistsSync.mockImplementation((path) => {
          if (path.includes('private-apps') && !path.includes('index'))
            return true;
          if (path.includes('/index.js')) return true;
          return false;
        });

        mockStatSync.mockImplementation(() => ({
          isDirectory: () => true,
        }));

        vi.spyOn(licenseModule, 'hasValidLicense').mockResolvedValue(true);

        const appList = await App.list();

        expect(appList).toEqual(['airtable', 'deepl', 'github', 'webhooks']);
      });

      it('should sort mixed regular and enterprise apps correctly', async () => {
        const mockReaddirSync = vi.spyOn(fs, 'readdirSync');
        const mockStatSync = vi.spyOn(fs, 'statSync');
        const mockExistsSync = vi.spyOn(fs, 'existsSync');

        mockReaddirSync.mockImplementation((path) => {
          if (path.includes('/apps') && !path.includes('private-apps'))
            return ['webhooks', 'forms'];
          if (path.includes('private-apps')) return ['airtable'];
          return [];
        });

        mockExistsSync.mockImplementation((path) => {
          if (path.includes('private-apps') && !path.includes('index'))
            return true;
          if (path.includes('webhooks/index.js')) return true;
          if (path.includes('forms/index.ee.js')) return true;
          if (path.includes('airtable/index.js')) return true;
          return false;
        });

        mockStatSync.mockImplementation(() => ({
          isDirectory: () => true,
        }));

        vi.spyOn(licenseModule, 'hasValidLicense').mockResolvedValue(true);

        const appList = await App.list();

        expect(appList).toEqual(['airtable', 'forms', 'webhooks']);
      });
    });

    describe('private apps directory file filtering', () => {
      it('should filter out files in private apps directory', async () => {
        const mockReaddirSync = vi.spyOn(fs, 'readdirSync');
        const mockStatSync = vi.spyOn(fs, 'statSync');
        const mockExistsSync = vi.spyOn(fs, 'existsSync');

        // Mock main apps directory empty, private apps with file and directory
        mockReaddirSync.mockImplementation((path) => {
          if (path.includes('/apps') && !path.includes('private-apps'))
            return [];
          if (path.includes('private-apps'))
            return ['app-dir', 'some-file.txt'];
          return [];
        });

        mockExistsSync.mockImplementation((path) => {
          if (path.includes('private-apps') && !path.includes('index'))
            return true;
          if (path.includes('app-dir/index.js')) return true;
          return false;
        });

        // Mock statSync to return file for some-file.txt, directory for app-dir
        mockStatSync.mockImplementation((path) => ({
          isDirectory: () => !path.includes('some-file.txt'),
        }));

        vi.spyOn(licenseModule, 'hasValidLicense').mockResolvedValue(true);

        const appList = await App.list();

        // Should only include the directory, not the file
        expect(appList).toEqual(['app-dir']);
        expect(appList).not.toContain('some-file.txt');
      });

      it('should handle apps with only index.ee.js files', async () => {
        const mockReaddirSync = vi.spyOn(fs, 'readdirSync');
        const mockStatSync = vi.spyOn(fs, 'statSync');
        const mockExistsSync = vi.spyOn(fs, 'existsSync');

        mockReaddirSync.mockImplementation((path) => {
          if (path.includes('/apps') && !path.includes('private-apps'))
            return ['enterprise-app'];
          if (path.includes('private-apps')) return [];
          return [];
        });

        mockExistsSync.mockImplementation((path) => {
          if (path.includes('private-apps')) return false;
          if (path.includes('enterprise-app/index.js')) return false;
          if (path.includes('enterprise-app/index.ee.js')) return true;
          return false;
        });

        mockStatSync.mockImplementation(() => ({
          isDirectory: () => true,
        }));

        vi.spyOn(licenseModule, 'hasValidLicense').mockResolvedValue(true);

        const appList = await App.list();

        expect(appList).toContain('enterprise-app');
      });

      it('should handle apps with neither index.js nor index.ee.js', async () => {
        const mockReaddirSync = vi.spyOn(fs, 'readdirSync');
        const mockStatSync = vi.spyOn(fs, 'statSync');
        const mockExistsSync = vi.spyOn(fs, 'existsSync');

        mockReaddirSync.mockImplementation((path) => {
          if (path.includes('/apps') && !path.includes('private-apps'))
            return ['incomplete-app'];
          if (path.includes('private-apps')) return [];
          return [];
        });

        mockExistsSync.mockImplementation((path) => {
          if (path.includes('private-apps')) return false;
          return false; // No index files exist
        });

        mockStatSync.mockImplementation(() => ({
          isDirectory: () => true,
        }));

        vi.spyOn(licenseModule, 'hasValidLicense').mockResolvedValue(true);

        const appList = await App.list();

        expect(appList).not.toContain('incomplete-app');
      });
    });
  });

  describe('findAll', () => {
    it('should return all applications when no name argument is provided', async () => {
      const apps = await App.findAll();
      const appList = await App.list();

      expect(apps.length).toBe(appList.length);
    });

    it('should return all applications when name argument is empty string', async () => {
      const apps = await App.findAll('');
      const appList = await App.list();

      expect(apps.length).toBe(appList.length);
    });

    it('should return matching applications when name argument is given', async () => {
      const apps = await App.findAll('deepl');

      expect(apps.length).toBe(1);
      expect(apps[0].key).toBe('deepl');
    });

    it('should return matching applications in plain JSON when stripFunc argument is true', async () => {
      const appFindOneByNameSpy = vi.spyOn(App, 'findOneByName');

      await App.findAll('deepl', true);

      expect(appFindOneByNameSpy).toHaveBeenCalledWith('deepl', true);
    });

    it('should return empty array when no apps match the name filter', async () => {
      const apps = await App.findAll('nonexistentapp');

      expect(apps).toEqual([]);
    });
  });

  describe('findOneByName', () => {
    it('should return app info for given app name', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => 'mock-app');

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation(() => 'app-info');

      const app = await App.findOneByName('DeepL');

      expect(getAppSpy).toHaveBeenCalledWith('deepl', false);
      expect(appInfoConverterSpy).toHaveBeenCalledWith('mock-app');
      expect(app).toStrictEqual('app-info');
    });

    it('should return app info for given app name in plain JSON when stripFunc argument is true', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => 'mock-app');

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation(() => 'app-info');

      const app = await App.findOneByName('DeepL', true);

      expect(getAppSpy).toHaveBeenCalledWith('deepl', true);
      expect(appInfoConverterSpy).toHaveBeenCalledWith('mock-app');
      expect(app).toStrictEqual('app-info');
    });
  });

  describe('findOneByKey', () => {
    it('should return app info for given app key', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => 'mock-app');

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation(() => 'app-info');

      const app = await App.findOneByKey('deepl');

      expect(getAppSpy).toHaveBeenCalledWith('deepl', false);
      expect(appInfoConverterSpy).toHaveBeenCalledWith('mock-app');
      expect(app).toStrictEqual('app-info');
    });

    it('should return app info for given app key in plain JSON when stripFunc argument is true', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => 'mock-app');

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation(() => 'app-info');

      const app = await App.findOneByKey('deepl', true);

      expect(getAppSpy).toHaveBeenCalledWith('deepl', true);
      expect(appInfoConverterSpy).toHaveBeenCalledWith('mock-app');
      expect(app).toStrictEqual('app-info');
    });
  });

  describe('findAuthByKey', () => {
    it('should return app auth for given app key', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({ auth: 'mock-auth' }));

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation((input) => input);

      const appAuth = await App.findAuthByKey('deepl');

      expect(getAppSpy).toHaveBeenCalledWith('deepl', false);
      expect(appInfoConverterSpy).toHaveBeenCalledWith({ auth: 'mock-auth' });
      expect(appAuth).toStrictEqual('mock-auth');
    });

    it('should return app auth for given app key in plain JSON when stripFunc argument is true', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({ auth: 'mock-auth' }));

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation((input) => input);

      const appAuth = await App.findAuthByKey('deepl', true);

      expect(getAppSpy).toHaveBeenCalledWith('deepl', true);
      expect(appInfoConverterSpy).toHaveBeenCalledWith({ auth: 'mock-auth' });
      expect(appAuth).toStrictEqual('mock-auth');
    });

    it('should return empty object when app has no auth', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({}));

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation((input) => input);

      const appAuth = await App.findAuthByKey('deepl');

      expect(getAppSpy).toHaveBeenCalledWith('deepl', false);
      expect(appInfoConverterSpy).toHaveBeenCalledWith({});
      expect(appAuth).toStrictEqual({});
    });
  });

  describe('findTriggersByKey', () => {
    it('should return app triggers for given app key', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({ triggers: 'mock-triggers' }));

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation((input) => input);

      const appTriggers = await App.findTriggersByKey('deepl');

      expect(getAppSpy).toHaveBeenCalledWith('deepl', false);
      expect(appInfoConverterSpy).toHaveBeenCalledWith({
        triggers: 'mock-triggers',
      });
      expect(appTriggers).toStrictEqual('mock-triggers');
    });

    it('should return app triggers for given app key in plain JSON when stripFunc argument is true', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({ triggers: 'mock-triggers' }));

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation((input) => input);

      const appTriggers = await App.findTriggersByKey('deepl', true);

      expect(getAppSpy).toHaveBeenCalledWith('deepl', true);
      expect(appInfoConverterSpy).toHaveBeenCalledWith({
        triggers: 'mock-triggers',
      });
      expect(appTriggers).toStrictEqual('mock-triggers');
    });

    it('should return empty array when app has no triggers', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({}));

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation((input) => input);

      const appTriggers = await App.findTriggersByKey('deepl');

      expect(getAppSpy).toHaveBeenCalledWith('deepl', false);
      expect(appInfoConverterSpy).toHaveBeenCalledWith({});
      expect(appTriggers).toStrictEqual([]);
    });
  });

  describe('findTriggerSubsteps', () => {
    it('should return app trigger substeps for given app key', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({
          triggers: [{ key: 'mock-trigger', substeps: 'mock-substeps' }],
        }));

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation((input) => input);

      const appTriggerSubsteps = await App.findTriggerSubsteps(
        'deepl',
        'mock-trigger'
      );

      expect(getAppSpy).toHaveBeenCalledWith('deepl', false);
      expect(appInfoConverterSpy).toHaveBeenCalledWith({
        triggers: [{ key: 'mock-trigger', substeps: 'mock-substeps' }],
      });
      expect(appTriggerSubsteps).toStrictEqual('mock-substeps');
    });

    it('should return app trigger substeps for given app key in plain JSON when stripFunc argument is true', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({
          triggers: [{ key: 'mock-trigger', substeps: 'mock-substeps' }],
        }));

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation((input) => input);

      const appTriggerSubsteps = await App.findTriggerSubsteps(
        'deepl',
        'mock-trigger',
        true
      );

      expect(getAppSpy).toHaveBeenCalledWith('deepl', true);
      expect(appInfoConverterSpy).toHaveBeenCalledWith({
        triggers: [{ key: 'mock-trigger', substeps: 'mock-substeps' }],
      });
      expect(appTriggerSubsteps).toStrictEqual('mock-substeps');
    });

    it('should return empty array when trigger is not found', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({
          triggers: [{ key: 'different-trigger', substeps: 'mock-substeps' }],
        }));

      vi.spyOn(appInfoConverterModule, 'default').mockImplementation(
        (input) => input
      );

      const appTriggerSubsteps = await App.findTriggerSubsteps(
        'deepl',
        'non-existent-trigger'
      );

      expect(getAppSpy).toHaveBeenCalledWith('deepl', false);
      expect(appTriggerSubsteps).toStrictEqual([]);
    });

    it('should return empty array when app has no triggers', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({}));

      vi.spyOn(appInfoConverterModule, 'default').mockImplementation(
        (input) => input
      );

      const appTriggerSubsteps = await App.findTriggerSubsteps(
        'deepl',
        'mock-trigger'
      );

      expect(getAppSpy).toHaveBeenCalledWith('deepl', false);
      expect(appTriggerSubsteps).toStrictEqual([]);
    });

    it('should return empty array when trigger has no substeps', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({
          triggers: [{ key: 'mock-trigger' }],
        }));

      vi.spyOn(appInfoConverterModule, 'default').mockImplementation(
        (input) => input
      );

      const appTriggerSubsteps = await App.findTriggerSubsteps(
        'deepl',
        'mock-trigger'
      );

      expect(getAppSpy).toHaveBeenCalledWith('deepl', false);
      expect(appTriggerSubsteps).toStrictEqual([]);
    });
  });

  describe('findActionsByKey', () => {
    it('should return app actions for given app key', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({ actions: 'mock-actions' }));

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation((input) => input);

      const appActions = await App.findActionsByKey('deepl');

      expect(getAppSpy).toHaveBeenCalledWith('deepl', false);
      expect(appInfoConverterSpy).toHaveBeenCalledWith({
        actions: 'mock-actions',
      });
      expect(appActions).toStrictEqual('mock-actions');
    });

    it('should return app actions for given app key in plain JSON when stripFunc argument is true', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({ actions: 'mock-actions' }));

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation((input) => input);

      const appActions = await App.findActionsByKey('deepl', true);

      expect(getAppSpy).toHaveBeenCalledWith('deepl', true);
      expect(appInfoConverterSpy).toHaveBeenCalledWith({
        actions: 'mock-actions',
      });
      expect(appActions).toStrictEqual('mock-actions');
    });

    it('should return empty array when app has no actions', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({}));

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation((input) => input);

      const appActions = await App.findActionsByKey('deepl');

      expect(getAppSpy).toHaveBeenCalledWith('deepl', false);
      expect(appInfoConverterSpy).toHaveBeenCalledWith({});
      expect(appActions).toStrictEqual([]);
    });
  });

  describe('findActionSubsteps', () => {
    it('should return app action substeps for given app key', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({
          actions: [{ key: 'mock-action', substeps: 'mock-substeps' }],
        }));

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation((input) => input);

      const appActionSubsteps = await App.findActionSubsteps(
        'deepl',
        'mock-action'
      );

      expect(getAppSpy).toHaveBeenCalledWith('deepl', false);
      expect(appInfoConverterSpy).toHaveBeenCalledWith({
        actions: [{ key: 'mock-action', substeps: 'mock-substeps' }],
      });
      expect(appActionSubsteps).toStrictEqual('mock-substeps');
    });

    it('should return app action substeps for given app key in plain JSON when stripFunc argument is true', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({
          actions: [{ key: 'mock-action', substeps: 'mock-substeps' }],
        }));

      const appInfoConverterSpy = vi
        .spyOn(appInfoConverterModule, 'default')
        .mockImplementation((input) => input);

      const appActionSubsteps = await App.findActionSubsteps(
        'deepl',
        'mock-action',
        true
      );

      expect(getAppSpy).toHaveBeenCalledWith('deepl', true);
      expect(appInfoConverterSpy).toHaveBeenCalledWith({
        actions: [{ key: 'mock-action', substeps: 'mock-substeps' }],
      });
      expect(appActionSubsteps).toStrictEqual('mock-substeps');
    });

    it('should return empty array when action is not found', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({
          actions: [{ key: 'different-action', substeps: 'mock-substeps' }],
        }));

      vi.spyOn(appInfoConverterModule, 'default').mockImplementation(
        (input) => input
      );

      const appActionSubsteps = await App.findActionSubsteps(
        'deepl',
        'non-existent-action'
      );

      expect(getAppSpy).toHaveBeenCalledWith('deepl', false);
      expect(appActionSubsteps).toStrictEqual([]);
    });

    it('should return empty array when app has no actions', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({}));

      vi.spyOn(appInfoConverterModule, 'default').mockImplementation(
        (input) => input
      );

      const appActionSubsteps = await App.findActionSubsteps(
        'deepl',
        'mock-action'
      );

      expect(getAppSpy).toHaveBeenCalledWith('deepl', false);
      expect(appActionSubsteps).toStrictEqual([]);
    });

    it('should return empty array when action has no substeps', async () => {
      const getAppSpy = vi
        .spyOn(getAppModule, 'default')
        .mockImplementation(() => ({
          actions: [{ key: 'mock-action' }],
        }));

      vi.spyOn(appInfoConverterModule, 'default').mockImplementation(
        (input) => input
      );

      const appActionSubsteps = await App.findActionSubsteps(
        'deepl',
        'mock-action'
      );

      expect(getAppSpy).toHaveBeenCalledWith('deepl', false);
      expect(appActionSubsteps).toStrictEqual([]);
    });
  });

  describe('checkAppAndAction', () => {
    it('should return undefined when app and action exist', async () => {
      const findOneByKeySpy = vi
        .spyOn(App, 'findOneByKey')
        .mockImplementation(() => ({
          actions: [
            {
              key: 'translate-text',
            },
          ],
        }));

      const appAndActionExist = await App.checkAppAndAction(
        'deepl',
        'translate-text'
      );

      expect(findOneByKeySpy).toHaveBeenCalledWith('deepl');
      expect(appAndActionExist).toBeUndefined();
    });

    it('should return undefined when app exists without action argument provided', async () => {
      const actionFindSpy = vi.fn();
      const findOneByKeySpy = vi
        .spyOn(App, 'findOneByKey')
        .mockImplementation(() => ({
          actions: {
            find: actionFindSpy,
          },
        }));

      const appAndActionExist = await App.checkAppAndAction('deepl');

      expect(findOneByKeySpy).toHaveBeenCalledWith('deepl');
      expect(actionFindSpy).not.toHaveBeenCalled();
      expect(appAndActionExist).toBeUndefined();
    });

    it('should throw an error when app exists, but action does not', async () => {
      const findOneByKeySpy = vi
        .spyOn(App, 'findOneByKey')
        .mockImplementation(() => ({ name: 'deepl' }));

      await expect(() =>
        App.checkAppAndAction('deepl', 'non-existing-action')
      ).rejects.toThrowError(
        'deepl does not have an action with the "non-existing-action" key!'
      );
      expect(findOneByKeySpy).toHaveBeenCalledWith('deepl');
    });

    it('should handle app with no actions property', async () => {
      const findOneByKeySpy = vi
        .spyOn(App, 'findOneByKey')
        .mockImplementation(() => ({ name: 'deepl' }));

      await expect(() =>
        App.checkAppAndAction('deepl', 'some-action')
      ).rejects.toThrowError(
        'deepl does not have an action with the "some-action" key!'
      );
      expect(findOneByKeySpy).toHaveBeenCalledWith('deepl');
    });
  });

  describe('checkAppAndTrigger', () => {
    it('should return undefined when app and trigger exist', async () => {
      const findOneByKeySpy = vi
        .spyOn(App, 'findOneByKey')
        .mockImplementation(() => ({
          triggers: [
            {
              key: 'catch-raw-webhook',
            },
          ],
        }));

      const appAndTriggerExist = await App.checkAppAndTrigger(
        'webhook',
        'catch-raw-webhook'
      );

      expect(findOneByKeySpy).toHaveBeenCalledWith('webhook');
      expect(appAndTriggerExist).toBeUndefined();
    });

    it('should return undefined when app exists without trigger argument provided', async () => {
      const triggerFindSpy = vi.fn();
      const findOneByKeySpy = vi
        .spyOn(App, 'findOneByKey')
        .mockImplementation(() => ({
          actions: {
            find: triggerFindSpy,
          },
        }));

      const appAndTriggerExist = await App.checkAppAndTrigger('webhook');

      expect(findOneByKeySpy).toHaveBeenCalledWith('webhook');
      expect(triggerFindSpy).not.toHaveBeenCalled();
      expect(appAndTriggerExist).toBeUndefined();
    });

    it('should throw an error when app exists, but trigger does not', async () => {
      const findOneByKeySpy = vi
        .spyOn(App, 'findOneByKey')
        .mockImplementation(() => ({ name: 'webhook' }));

      await expect(() =>
        App.checkAppAndTrigger('webhook', 'non-existing-trigger')
      ).rejects.toThrowError(
        'webhook does not have a trigger with the "non-existing-trigger" key!'
      );
      expect(findOneByKeySpy).toHaveBeenCalledWith('webhook');
    });

    it('should handle app with no triggers property', async () => {
      const findOneByKeySpy = vi
        .spyOn(App, 'findOneByKey')
        .mockImplementation(() => ({ name: 'webhook' }));

      await expect(() =>
        App.checkAppAndTrigger('webhook', 'some-trigger')
      ).rejects.toThrowError(
        'webhook does not have a trigger with the "some-trigger" key!'
      );
      expect(findOneByKeySpy).toHaveBeenCalledWith('webhook');
    });
  });
});
