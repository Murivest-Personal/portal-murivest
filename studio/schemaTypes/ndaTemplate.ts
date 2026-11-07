
import {defineField, defineType} from 'sanity'

// =====================================================
// 1. MASTER NDA TEMPLATE
// Stores approved NDA templates issued to investors.
// =====================================================

export const ndaTemplate = defineType({
  name: 'ndaTemplate',
  title: 'NDA Templates',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Template Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'version',
      title: 'Template Version',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'scope',
      title: 'NDA Scope',
      type: 'string',
      initialValue: 'general',
      options: {
        list: [
          {title: 'General Investor NDA', value: 'general'},
          {title: 'Brief / Preliminary NDA', value: 'brief'},
          {title: 'Property-Specific NDA', value: 'property'},
        ],
      },
    }),

    defineField({
      name: 'jurisdiction',
      title: 'Governing Jurisdiction',
      type: 'string',
      initialValue: 'Kenya',
    }),

    defineField({
      name: 'summary',
      title: 'Document Summary',
      type: 'text',
      rows: 3,
      description: 'Plain-language summary displayed before signing.',
    }),

    defineField({
      name: 'file',
      title: 'Original NDA PDF',
      type: 'file',
      options: {accept: '.pdf'},
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'effectiveDate',
      title: 'Effective Date',
      type: 'date',
    }),

    defineField({
      name: 'active',
      title: 'Active Template',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'version',
    },
  },
})


// =====================================================
// 2. SIGNED NDA DOCUMENTS
// Stores completed PDFs uploaded by investors.
// =====================================================

export const signedNda = defineType({
  name: 'signedNda',
  title: 'Signed Investor NDAs',
  type: 'document',

  fields: [

    // Document identification

    defineField({
      name: 'documentTitle',
      title: 'Document Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'referenceNumber',
      title: 'NDA Reference Number',
      type: 'string',
      description: 'Unique internal Murivest NDA reference.',
      validation: (Rule) => Rule.required(),
    }),

    // Investor identification

    defineField({
      name: 'investorName',
      title: 'Investor Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'investorEmail',
      title: 'Investor Email',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'investorId',
      title: 'Investor Portal ID',
      type: 'string',
      description: 'ID linking the document to the investor account.',
    }),

    // Original NDA template reference

    defineField({
      name: 'originalTemplate',
      title: 'Original NDA Template',
      type: 'reference',
      to: [{type: 'ndaTemplate'}],
      description: 'The original template issued to this investor.',
    }),

    defineField({
      name: 'templateVersion',
      title: 'Signed Template Version',
      type: 'string',
      description: 'Snapshot of the version the investor received.',
      validation: (Rule) => Rule.required(),
    }),

    // Signed document upload

    defineField({
      name: 'signedDocument',
      title: 'Completed Signed NDA PDF',
      type: 'file',
      options: {
        accept: '.pdf',
      },
      description:
        'Final signed PDF uploaded by the investor after signing.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'originalFileName',
      title: 'Original Uploaded File Name',
      type: 'string',
    }),

    defineField({
      name: 'fileSize',
      title: 'File Size (Bytes)',
      type: 'number',
    }),

    defineField({
      name: 'documentHash',
      title: 'Document SHA-256 Hash',
      type: 'string',
      description:
        'Calculated server-side to help verify document integrity.',
    }),

    // Signing information

    defineField({
      name: 'signedAt',
      title: 'Date and Time Signed',
      type: 'datetime',
    }),

    defineField({
      name: 'uploadedAt',
      title: 'Upload Date and Time',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'signatureMethod',
      title: 'Signing Method',
      type: 'string',
      options: {
        list: [
          {title: 'Electronic Signature', value: 'electronic'},
          {title: 'Digital Certificate Signature', value: 'digital_certificate'},
          {title: 'Handwritten Signature (Scanned)', value: 'handwritten_scanned'},
          {title: 'PDF Editor Signature', value: 'pdf_editor'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),

    // Internal review and verification

    defineField({
      name: 'status',
      title: 'Document Status',
      type: 'string',
      initialValue: 'uploaded',
      options: {
        list: [
          {title: 'Uploaded - Awaiting Review', value: 'uploaded'},
          {title: 'Under Review', value: 'under_review'},
          {title: 'Verified', value: 'verified'},
          {title: 'Rejected', value: 'rejected'},
          {title: 'Superseded', value: 'superseded'},
        ],
      },
    }),

    defineField({
      name: 'reviewedBy',
      title: 'Reviewed By',
      type: 'string',
    }),

    defineField({
      name: 'reviewedAt',
      title: 'Review Date',
      type: 'datetime',
    }),

    defineField({
      name: 'reviewNotes',
      title: 'Internal Review Notes',
      type: 'text',
      rows: 4,
    }),

    defineField({
      name: 'verificationNotes',
      title: 'Verification Details',
      type: 'text',
      rows: 3,
    }),

    // Additional administrative information

    defineField({
      name: 'propertyReference',
      title: 'Related Property / Investment Reference',
      type: 'string',
    }),

    defineField({
      name: 'internalNotes',
      title: 'Internal Administrative Notes',
      type: 'text',
      rows: 3,
    }),
  ],

  preview: {
    select: {
      title: 'investorName',
      subtitle: 'referenceNumber',
      status: 'status',
    },

    prepare({title, subtitle, status}) {
      return {
        title: title || 'Unnamed Investor',
        subtitle: `${subtitle || 'No reference'} · ${status || 'Unknown status'}`,
      }
    },
  },

  orderings: [
    {
      title: 'Most Recently Uploaded',
      name: 'uploadedAtDesc',
      by: [{field: 'uploadedAt', direction: 'desc'}],
    },
  ],
})
