// Shared types for Design Award Matching Engine

export interface Award {
  id: string
  name: string
  nameCn: string
  slug: string
  website: string
  description: string
  logo?: string

  categories: AwardCategory[]

  fee: {
    professional: number
    student?: number
    lateSurcharge?: number
    awardPackage?: number
  }

  deadlines: {
    early?: string
    regular: string
    late?: string
    result?: string
  }

  judgingCriteria: {
    innovation: number
    aesthetics: number
    functionality: number
    craftsmanship: number
    socialImpact: number
    commercial: number
  }

  stylePreferences?: string[]
  winRate?: number
  difficulty: 1 | 2 | 3
  studentTrack: boolean

  lastUpdated: string
}

export type AwardCategory =
  | 'product'
  | 'visual'
  | 'space'
  | 'interaction'
  | 'service'
  | 'fashion'
  | 'concept'

export interface ProjectAssessment {
  name: string
  type: AwardCategory | ''
  industry: string
  market: string
  stage: string
  budget: string
  description: string
  imageCount: number
}

export interface MatchResult {
  awardId: string
  award: Award
  score: number
  categoryMatch: boolean
  criteriaFit: number
  styleFit: number
  budgetFit: number
  deadlineFit: number
  reason: string
  optimizationTip?: string
}

export interface AssessmentRecord {
  id: string
  userId: string
  projectName: string
  projectType: string
  description: string
  imageCount: number
  results: MatchResult[]
  createdAt: string
}

export interface User {
  id: string
  phone: string
  name?: string
  company?: string
  monthlyAssessments: number
  quotaMonth: string
  createdAt: string
}

export interface Article {
  id: string
  title: string
  description: string
  slug: string
  content: ArticleSection[]
  category: string
  categoryLabel: string
  tags: string[]
  publishedAt: string
  readingTime: number
  relatedAwards?: string[]
}

export interface ArticleSection {
  title?: string
  paragraphs?: string[]
  list?: string[]
  afterList?: string[]
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface Partner {
  id: string
  name: string
  description: string
  contactPhone: string
  website?: string
  serviceScope: string[]
  isActive: boolean
  logo?: string
  createdAt: string
}
