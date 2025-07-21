import { describe, it, expect, vi } from 'vitest';
import Form from '@/models/form.ee.js';
import User from '@/models/user.js';
import Base from '@/models/base.js';
import { createForm } from '@/factories/form.js';
import { createUser } from '@/factories/user.js';

describe('Form model', () => {
  it('tableName should return correct name', () => {
    expect(Form.tableName).toBe('forms');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Form.jsonSchema).toMatchSnapshot();
  });

  describe('relationMappings', () => {
    it('should return correct associations', () => {
      const relationMappings = Form.relationMappings();

      const expectedRelations = {
        user: {
          relation: Base.BelongsToOneRelation,
          modelClass: User,
          join: {
            from: 'forms.user_id',
            to: 'users.id',
          },
        },
      };

      expect(relationMappings).toStrictEqual(expectedRelations);
    });
  });

  describe('validateArrayFieldConstraints', () => {
    describe('when maxItems < minItems', () => {
      it('should throw error with descriptive message', () => {
        const form = new Form();
        form.fields = [
          {
            type: 'array',
            name: 'Test Array',
            minItems: 5,
            maxItems: 2,
          },
        ];

        expect(() => form.validateArrayFieldConstraints()).toThrow(
          'Array field "Test Array" has maxItems (2) less than minItems (5)'
        );
      });
    });

    describe('when maxItems < 1', () => {
      it('should throw error when maxItems is 0', () => {
        const form = new Form();
        form.fields = [
          {
            type: 'array',
            name: 'Test Array',
            maxItems: 0,
          },
        ];

        expect(() => form.validateArrayFieldConstraints()).toThrow(
          'Array field "Test Array" has maxItems (0) but maxItems must be at least 1'
        );
      });

      it('should throw error when maxItems is negative', () => {
        const form = new Form();
        form.fields = [
          {
            type: 'array',
            name: 'Test Array',
            maxItems: -1,
          },
        ];

        expect(() => form.validateArrayFieldConstraints()).toThrow(
          'Array field "Test Array" has maxItems (-1) but maxItems must be at least 1'
        );
      });
    });

    describe('when constraints are valid', () => {
      it('should not throw error when maxItems >= minItems', () => {
        const form = new Form();
        form.fields = [
          {
            type: 'array',
            name: 'Test Array',
            minItems: 2,
            maxItems: 5,
          },
        ];

        expect(() => form.validateArrayFieldConstraints()).not.toThrow();
      });

      it('should not throw error when maxItems equals minItems', () => {
        const form = new Form();
        form.fields = [
          {
            type: 'array',
            name: 'Test Array',
            minItems: 3,
            maxItems: 3,
          },
        ];

        expect(() => form.validateArrayFieldConstraints()).not.toThrow();
      });

      it('should not throw error when only minItems is set', () => {
        const form = new Form();
        form.fields = [
          {
            type: 'array',
            name: 'Test Array',
            minItems: 2,
          },
        ];

        expect(() => form.validateArrayFieldConstraints()).not.toThrow();
      });

      it('should not throw error when only maxItems is set', () => {
        const form = new Form();
        form.fields = [
          {
            type: 'array',
            name: 'Test Array',
            maxItems: 5,
          },
        ];

        expect(() => form.validateArrayFieldConstraints()).not.toThrow();
      });

      it('should not throw error when maxItems is 1', () => {
        const form = new Form();
        form.fields = [
          {
            type: 'array',
            name: 'Test Array',
            maxItems: 1,
          },
        ];

        expect(() => form.validateArrayFieldConstraints()).not.toThrow();
      });
    });

    describe('edge cases', () => {
      it('should handle null fields gracefully', () => {
        const form = new Form();
        form.fields = null;

        expect(() => form.validateArrayFieldConstraints()).not.toThrow();
      });

      it('should handle undefined fields gracefully', () => {
        const form = new Form();
        form.fields = undefined;

        expect(() => form.validateArrayFieldConstraints()).not.toThrow();
      });

      it('should handle empty fields array', () => {
        const form = new Form();
        form.fields = [];

        expect(() => form.validateArrayFieldConstraints()).not.toThrow();
      });

      it('should skip non-array fields', () => {
        const form = new Form();
        form.fields = [
          {
            type: 'string',
            name: 'Text Field',
          },
          {
            type: 'checkbox',
            name: 'Checkbox Field',
          },
        ];

        expect(() => form.validateArrayFieldConstraints()).not.toThrow();
      });

      it('should handle multiple array fields with mixed validity', () => {
        const form = new Form();
        form.fields = [
          {
            type: 'array',
            name: 'Valid Array',
            minItems: 1,
            maxItems: 5,
          },
          {
            type: 'string',
            name: 'Text Field',
          },
          {
            type: 'array',
            name: 'Invalid Array',
            minItems: 5,
            maxItems: 2,
          },
        ];

        expect(() => form.validateArrayFieldConstraints()).toThrow(
          'Array field "Invalid Array" has maxItems (2) less than minItems (5)'
        );
      });

      it('should validate all array fields and stop at first error', () => {
        const form = new Form();
        form.fields = [
          {
            type: 'array',
            name: 'First Invalid',
            maxItems: 0,
          },
          {
            type: 'array',
            name: 'Second Invalid',
            minItems: 5,
            maxItems: 2,
          },
        ];

        expect(() => form.validateArrayFieldConstraints()).toThrow(
          'Array field "First Invalid" has maxItems (0) but maxItems must be at least 1'
        );
      });
    });
  });

  describe('$beforeInsert', () => {
    it('should call super.$beforeInsert', async () => {
      const superBeforeInsertSpy = vi.spyOn(Base.prototype, '$beforeInsert');

      await createForm();

      expect(superBeforeInsertSpy).toHaveBeenCalled();
    });

    it('should call validateArrayFieldConstraints during insert', async () => {
      const validateArrayFieldConstraintsSpy = vi
        .spyOn(Form.prototype, 'validateArrayFieldConstraints')
        .mockImplementation(() => {});

      await createForm();

      expect(validateArrayFieldConstraintsSpy).toHaveBeenCalledOnce();
    });

    it('should throw error when array constraints are invalid during insert', async () => {
      const user = await createUser();

      await expect(
        createForm({
          userId: user.id,
          fields: [
            {
              type: 'array',
              name: 'Invalid Array',
              key: 'invalid_array',
              minItems: 5,
              maxItems: 2,
            },
          ],
        })
      ).rejects.toThrow(
        'Array field "Invalid Array" has maxItems (2) less than minItems (5)'
      );
    });

    it('should succeed when array constraints are valid during insert', async () => {
      const user = await createUser();

      const form = await createForm({
        userId: user.id,
        fields: [
          {
            type: 'array',
            name: 'Valid Array',
            key: 'valid_array',
            minItems: 1,
            maxItems: 5,
          },
        ],
      });

      expect(form.id).toBeDefined();
      expect(form.fields[0].type).toBe('array');
    });
  });

  describe('$beforeUpdate', () => {
    it('should call super.$beforeUpdate', async () => {
      const form = await createForm();
      const superBeforeUpdateSpy = vi.spyOn(Base.prototype, '$beforeUpdate');

      await form.$query().patch({ name: 'Updated Form' });

      expect(superBeforeUpdateSpy).toHaveBeenCalled();
    });

    it('should call validateArrayFieldConstraints during update', async () => {
      const form = await createForm();

      const validateArrayFieldConstraintsSpy = vi
        .spyOn(Form.prototype, 'validateArrayFieldConstraints')
        .mockImplementation(() => {});

      await form.$query().patch({
        fields: [
          {
            type: 'array',
            name: 'Updated Array',
            key: 'updated_array',
            minItems: 1,
            maxItems: 3,
          },
        ],
      });

      expect(validateArrayFieldConstraintsSpy).toHaveBeenCalledOnce();
    });

    it('should throw error when array constraints are invalid during update', async () => {
      const form = await createForm();

      await expect(
        form.$query().patch({
          fields: [
            {
              type: 'array',
              name: 'Invalid Array',
              key: 'invalid_array',
              minItems: 10,
              maxItems: 2,
            },
          ],
        })
      ).rejects.toThrow(
        'Array field "Invalid Array" has maxItems (2) less than minItems (10)'
      );
    });

    it('should succeed when array constraints are valid during update', async () => {
      const form = await createForm();

      const updatedForm = await form.$query().patchAndFetch({
        fields: [
          {
            type: 'array',
            name: 'Valid Updated Array',
            key: 'valid_updated_array',
            minItems: 2,
            maxItems: 8,
          },
        ],
      });

      expect(updatedForm.fields[0].name).toBe('Valid Updated Array');
      expect(updatedForm.fields[0].minItems).toBe(2);
      expect(updatedForm.fields[0].maxItems).toBe(8);
    });

    it('should handle updating non-array fields without validation', async () => {
      const form = await createForm({
        fields: [
          {
            type: 'string',
            name: 'Text Field',
            key: 'text_field',
          },
        ],
      });

      const updatedForm = await form.$query().patchAndFetch({
        name: 'Updated Form Name',
        description: 'Updated description',
      });

      expect(updatedForm.name).toBe('Updated Form Name');
      expect(updatedForm.description).toBe('Updated description');
    });
  });
});
