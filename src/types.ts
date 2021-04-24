export interface BasicFilter {
  value: string
  keys: string[]
  exact?: boolean
}

export interface CustomFilter {
  value?: any;
  custom: CustomFilterFunction;
}

export type CustomFilterFunction = (value: any, row: Record<string, any>) => boolean

export type Filters = Record<string, BasicFilter | CustomFilter>

export type SelectionMode = 'single' | 'multiple'

export type SortKey = string | ((obj: any, sortOrder: SortOrder) => any) | null;
export type CustomSort = ((a: any, b: any, sortOrder: SortOrder) => number) | null;
export enum SortOrder {
  DESC = -1,
  NONE = 0,
  ASC= 1
}

