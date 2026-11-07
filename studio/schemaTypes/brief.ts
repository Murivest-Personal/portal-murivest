import {defineArrayMember, defineField, defineType} from 'sanity'

const str = (name: string, title?: string) => defineField({name, title, type: 'string'})
const num = (name: string, title?: string) => defineField({name, title, type: 'number'})
const strList = (name: string, title?: string) =>
  defineField({name, title, type: 'array', of: [defineArrayMember({type: 'string'})]})

export const brief = defineType({
  name: 'brief',
  title: 'Investment Brief',
  type: 'document',
  groups: [
    {name: 'overview', title: 'Overview', default: true},
    {name: 'access', title: 'Access & Pricing'},
    {name: 'memo', title: 'Memorandum'},
  ],
  fields: [
    defineField({name: 'title', type: 'string', group: 'overview', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'overview',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({name: 'subtitle', type: 'string', group: 'overview'}),
    defineField({
      name: 'assetClass',
      type: 'string',
      group: 'overview',
      options: {
        list: ['Commercial Office', 'Industrial/Logistics', 'Residential', 'Mixed-Use', 'Land', 'Retail', 'Hospitality'],
      },
      validation: (r) => r.required(),
    }),
    defineField({name: 'investmentType', type: 'string', group: 'overview', description: 'e.g. Development / Forward Commitment'}),
    defineField({
      name: 'status',
      type: 'string',
      group: 'overview',
      initialValue: 'active',
      options: {list: [
        {title: 'Active', value: 'active'},
        {title: 'Under offer', value: 'under_offer'},
        {title: 'Closed (hidden from portal)', value: 'closed'},
      ]},
      validation: (r) => r.required(),
    }),
    defineField({name: 'location', type: 'string', group: 'overview', validation: (r) => r.required()}),
    defineField({name: 'locationDetail', type: 'string', group: 'overview', description: 'Hidden from users who have not signed the NDA when "Requires NDA" is on.'}),
    defineField({name: 'teaser', type: 'text', rows: 3, group: 'overview', validation: (r) => r.required().max(500)}),
    defineField({name: 'summary', type: 'text', rows: 5, group: 'overview', description: 'Executive summary shown on the detail page (falls back to the thesis, then the teaser).'}),
    defineField({name: 'publishedAt', type: 'datetime', group: 'overview', initialValue: () => new Date().toISOString()}),
    defineField({name: 'highlights', type: 'array', group: 'overview', of: [{type: 'string'}], description: 'First three show on the card.'}),
    defineField({
      name: 'metrics',
      type: 'array',
      group: 'overview',
      description: 'Quick metrics on the card (max 4).',
      validation: (r) => r.max(4),
      of: [defineArrayMember({type: 'object', fields: [str('label'), str('value')], preview: {select: {title: 'label', subtitle: 'value'}}})],
    }),
    defineField({name: 'targetIrr', type: 'string', group: 'overview'}),
    defineField({name: 'targetYield', type: 'string', group: 'overview'}),
    defineField({name: 'holdPeriod', type: 'string', group: 'overview'}),

    defineField({
      name: 'accessLevel',
      type: 'string',
      group: 'access',
      initialValue: 'registered',
      options: {list: [
        {title: 'Registered (public summary)', value: 'registered'},
        {title: 'Verified (full memorandum)', value: 'verified'},
        {title: 'Premium (off-market / co-invest)', value: 'premium'},
      ]},
      validation: (r) => r.required(),
    }),
    defineField({name: 'requiresNda', type: 'boolean', group: 'access', initialValue: false}),
    defineField({name: 'requiresOrder', type: 'boolean', group: 'access', initialValue: false}),
    defineField({name: 'orderPriceUsd', type: 'number', group: 'access', hidden: ({parent}) => !parent?.requiresOrder}),
    defineField({name: 'confidentiality', type: 'string', group: 'access', description: 'Short note on the card, e.g. "NDA required for location disclosure"'}),
    defineField({name: 'confidentialityLevel', type: 'string', group: 'access', initialValue: 'Strictly Confidential'}),
    defineField({name: 'priceKes', type: 'number', group: 'access'}),
    defineField({name: 'priceUsd', type: 'number', group: 'access'}),

    defineField({
      name: 'executiveSummary',
      type: 'object',
      group: 'memo',
      fields: [
        defineField({name: 'thesis', type: 'text', rows: 5}),
        strList('highlights'),
        defineField({name: 'pricing', type: 'object', fields: [
          num('totalInvestment', 'Total investment (KES)'),
          num('equityRequired', 'Equity required (KES)'),
          num('debtArranged', 'Debt arranged (KES)'),
          num('pricePerSqm', 'Price per sqm (KES)'),
          num('pricePerSqmUsd', 'Price per sqm (USD)'),
        ]}),
        defineField({name: 'returns', type: 'object', fields: [
          str('preferredReturn'), str('promoteStructure'), str('targetEquityMultiple'),
        ]}),
      ],
    }),
    defineField({
      name: 'investmentStrategy',
      type: 'object',
      group: 'memo',
      fields: [
        defineField({name: 'marketContext', type: 'text', rows: 6}),
        strList('valueCreation'),
        strList('competitiveAdvantages'),
        strList('exitOptions'),
      ],
    }),
    defineField({
      name: 'management',
      type: 'object',
      group: 'memo',
      fields: [
        defineField({name: 'sponsor', type: 'object', fields: [str('name'), str('trackRecord'), str('realizedIRR')]}),
        defineField({name: 'assetManager', type: 'object', fields: [str('name'), str('role'), str('feeStructure')]}),
        defineField({name: 'keyPersonnel', type: 'array', of: [defineArrayMember({type: 'object', fields: [str('name'), str('role'), str('experience')]})]}),
      ],
    }),
    defineField({
      name: 'financialAnalysis',
      type: 'object',
      group: 'memo',
      fields: [
        defineField({name: 'revenueProjections', type: 'array', of: [defineArrayMember({type: 'object', fields: [
          str('period'), num('grossRevenue', 'Gross revenue (KES)'), num('noi', 'NOI (KES)'), str('occupancy'),
        ]})]}),
        defineField({name: 'sensitivityAnalysis', type: 'array', of: [defineArrayMember({type: 'object', fields: [
          str('scenario'), str('irr'), str('moic'),
        ]})]}),
      ],
    }),
    defineField({
      name: 'riskFactors',
      type: 'array',
      group: 'memo',
      of: [defineArrayMember({type: 'object', fields: [
        str('category'),
        defineField({name: 'description', type: 'text', rows: 2}),
        defineField({name: 'mitigation', type: 'text', rows: 2}),
        defineField({name: 'severity', type: 'string', options: {list: ['low', 'medium', 'high']}}),
      ]})],
    }),
    defineField({
      name: 'dueDiligence',
      type: 'object',
      group: 'memo',
      fields: [
        str('completion', 'Completion (e.g. 85%)'),
        str('legalCounsel'), str('taxAdvisor'), str('environmental'),
        defineField({name: 'lastUpdated', type: 'date'}),
        defineField({name: 'areas', type: 'array', of: [defineArrayMember({type: 'object', fields: [
          str('category'),
          defineField({name: 'status', type: 'string', options: {list: ['completed', 'in-progress', 'pending']}}),
          strList('items'),
        ]})]}),
      ],
    }),
    defineField({
      name: 'investmentTerms',
      type: 'object',
      group: 'memo',
      fields: [
        str('structure'),
        num('minimumInvestment', 'Minimum investment (KES)'),
        num('targetRaise', 'Target raise (KES)'),
        str('investorQualification'), str('governance'), str('reporting'),
        defineField({name: 'timeline', type: 'array', of: [defineArrayMember({type: 'object', fields: [
          str('label'), defineField({name: 'date', type: 'date'}),
        ], preview: {select: {title: 'label', subtitle: 'date'}}})]}),
      ],
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'assetClass'}},
  orderings: [{title: 'Newest', name: 'newest', by: [{field: 'publishedAt', direction: 'desc'}]}],
})