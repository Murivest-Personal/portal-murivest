import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const singletons = ['dealRoomSettings']

export default defineConfig({
  name: 'default',
  title: 'Murivest Portal',
  projectId: '1ulsmgeb',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Deal Room Settings')
              .id('dealRoomSettings')
              .child(S.document().schemaType('dealRoomSettings').documentId('dealRoomSettings')),
            S.divider(),
            ...S.documentTypeListItems().filter((i) => !singletons.includes(i.getId() as string)),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (t) => t.filter(({schemaType}) => !singletons.includes(schemaType)),
  },
  document: {
    actions: (prev, {schemaType}) =>
      singletons.includes(schemaType)
        ? prev.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : prev,
  },
})