/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import yaml from 'js-yaml';

export function loadSwaggerSpec(): any {
  const files = globSync(path.join(__dirname, 'docs/**/*.yml'));

  // Find and load base.yml first
  const baseFile = files.find((file) => path.basename(file) === 'base.yml');
  const otherFiles = files.filter((file) => path.basename(file) !== 'base.yml');

  // Initialize with default structure
  const openapiDoc: any = {
    openapi: '3.0.0',
    info: {
      title: 'RBAC API',
      version: '1.0.0',
    },
    paths: {},
    components: {
      schemas: {},
      responses: {},
      parameters: {},
      securitySchemes: {},
    },
  };

  // Load base.yml first if it exists
  if (baseFile) {
    const baseDoc = yaml.load(fs.readFileSync(baseFile, 'utf8')) as any;
    mergeDocs(openapiDoc, baseDoc);
  }

  // Then load other files
  for (const file of otherFiles) {
    const doc = yaml.load(fs.readFileSync(file, 'utf8')) as any;
    mergeDocs(openapiDoc, doc);
  }

  return openapiDoc;
}

function mergeDocs(openapiDoc: any, doc: any): void {
  // Merge paths
  if (doc.paths) {
    Object.assign(openapiDoc.paths, doc.paths);
  }

  // Merge components
  if (doc.components) {
    for (const [componentType, componentValue] of Object.entries(
      doc.components,
    )) {
      if (openapiDoc.components[componentType]) {
        Object.assign(openapiDoc.components[componentType], componentValue);
      } else {
        openapiDoc.components[componentType] = componentValue;
      }
    }
  }

  // Merge other top-level properties
  ['tags', 'servers', 'security', 'externalDocs'].forEach((prop) => {
    if (doc[prop] && !openapiDoc[prop]) {
      openapiDoc[prop] = doc[prop];
    }
  });

  // Merge info object properties
  if (doc.info) {
    Object.assign(openapiDoc.info, doc.info);
  }
}
