/**
 * @description
 * @param 1
 * {
    'policyHolder.email_gte': 'duocdevtest@gmail.com',
    'insuredPerson.0._in': 'duocdevtest@gmail.com',
    'policyHolder.email_like': '/name/i',
    _q: 'hihi',
    createdAt_sort: 'desc',
    _id_sort: 'desc',
    last_name_sort: 'asc',
    _select: 'policyHolder',
    _nselect: 'insuredPerson.1',
    _exists: '!policySetting',
    _offset: '10',
    _limit: '100',
    _conjunction: 'and',
    policy_embed: 'quote'
  }
 @param 2
    {
      filter: {
        'policyHolder.email': [String, Number]
      }
    }
 */


type JSString = typeof String;
type JSNumber = typeof Number;
type JSBoolean = typeof Boolean;
type JSDate = typeof Date;
type JSRegExp = typeof RegExp;
type JSData =
  | JSString
  | JSNumber
  | JSBoolean
  | JSDate
  | JSRegExp
  | undefined
  | null;
type FilterValidationOptions = {
  [key: string]: (JSData | Array<JSData>)[];
};
type Key = '$and' | '$or' | '$nor' | '$text';
const filterKey: Record<Key, string> = {
  $and: '$and',
  $or: '$or',
  $nor: '$nor',
  $text: '$text'
}
type PartialRecord<K extends keyof typeof filterKey, T> = {
  [P in K]?: T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Filter = PartialRecord<Key, any>;
type SortValue = 'asc' | 'desc' | 1 | -1;
type Sort = Record<string, SortValue>;
type Projection = Record<string, number | boolean>;
type Pagination = {
  limit?: number;
  offset?: number;
};
type Reference = Record<string, string>;
interface ValidationOptions {
  filter?: FilterValidationOptions;
}

export abstract class MongoDBQuery<
  Filter = null,
  Pagination = null,
  Sort = null,
  Projection = null,
  Reference = null
> {
  abstract filter: Filter;
  abstract pagination: Pagination;
  abstract sort: Sort;
  abstract projection: Projection;
  abstract reference: Reference;
}

export class Query {
  private static instance: Query;
  private static queryOperator = {
    _eq: '$eq',
    _ne: '$ne',
    _gt: '$gt',
    _gte: '$gte',
    _lt: '$lt',
    _lte: '$lte',
    _in: '$in',
    _nin: '$nin',
    _like: '$regex',
    _q: filterKey.$text,
    _exists: '$exists'
  };
  private static logicalOperator = {
    _conjunction: {
      and: filterKey.$and,
      nor: filterKey.$nor,
      or: filterKey.$or
    }
  };
  private static sortOperator = {
    _sort: true
  };
  private static selectOperator = {
    _select: 1
  };
  private static notSelectOperator = {
    _nselect: 0
  };
  private static lookupOperator = {
    _embed: true
  };
  private static paginationOperator = {
    _limit: 'limit',
    _offset: 'offset'
  };

  public static getInstance(): Query {
    if (!Query.instance) {
      Query.instance = new Query()
    }
    return Query.instance
  }

  private parseNumberToString(value: string | number): string {
    return typeof value === 'number' ? value.toString() : value
  }

  public parseMongoDB<T>(
    queryData: T,
    validationOptions?: ValidationOptions
  ): MongoDBQuery<
    Filter | null,
    Pagination | null,
    Sort | null,
    Projection | null,
    Reference | null
  > {
    let filter: Filter | null = null
    let sort: Sort | null = null
    let selection: Projection | null = null
    let notSelection: Projection | null = null
    let pagination: Pagination | null = null
    let reference: Reference | null = null
    const defaultLogical: string = Query.logicalOperator._conjunction.and
    let runtimeLogical: string | null = null

    for (const key in queryData) {
      const value = queryData[key]
      const lastIndexOf_: number = key.lastIndexOf('_')
      const keyLength: number = key.length

      let operator: string = key
      if (lastIndexOf_ > 0) {
        operator = key.substring(lastIndexOf_, keyLength)
      }

      // Filter
      const queryOpr =
        Query.queryOperator?.[operator as keyof typeof Query.queryOperator]
      if (queryOpr) {
        if (!filter) {
          filter = {
            [defaultLogical]: []
          }
        }
        const field = key.replace(operator, '')
        const isValidateFilter: boolean = !!validationOptions?.filter
        const fieldValidation = validationOptions?.filter?.[field]

        if (
          queryOpr === Query.queryOperator._eq ||
          queryOpr === Query.queryOperator._ne ||
          queryOpr === Query.queryOperator._gt ||
          queryOpr === Query.queryOperator._gte ||
          queryOpr === Query.queryOperator._lt ||
          queryOpr === Query.queryOperator._lte
        ) {
          if (isValidateFilter) {
            let isValidate = false
            fieldValidation?.forEach((typeConstructor) => {
              if (
                !Array.isArray(typeConstructor) &&
                typeConstructor !== undefined &&
                typeConstructor !== null
              ) {
                isValidate = !isValidate
                  ? new Object(value) instanceof typeConstructor
                  : isValidate
              } else if (typeConstructor === undefined && value === undefined) {
                isValidate = true
              } else if (typeConstructor === null && value === null) {
                isValidate = true
              }
            })
            if (!isValidate) continue
          }

          filter?.[defaultLogical as keyof typeof filter]?.push({
            [field]: {
              [queryOpr]: value
            }
          })
        } else if (
          queryOpr === Query.queryOperator._exists &&
          typeof value === 'string'
        ) {
          const listQueryValue = value.replace(/\s/g, '').split(',')
          listQueryValue?.forEach((field) => {
            if (field) {
              const isNotExists: boolean = field.charAt(0) === '!'
              const queryField: string = isNotExists
                ? field.replace('!', '')
                : field

              filter?.[defaultLogical as keyof typeof filter]?.push({
                [queryField]: {
                  [queryOpr]: !isNotExists
                }
              })
            }
          })
        } else if (
          queryOpr === Query.queryOperator._in ||
          queryOpr === Query.queryOperator._nin
        ) {
          let listQueryValue: unknown
          const validatedListQueryValue: unknown[] = []

          if (typeof value === 'string' || typeof value === 'number') {
            const parsedStrValue: string = this.parseNumberToString(value)
            listQueryValue = parsedStrValue
              ?.replace(/\s/g, '')
              .split(',')
              .filter((elem) => elem)
          } else if (Array.isArray(value)) {
            listQueryValue = value
          }

          if (isValidateFilter && Array.isArray(value)) {
            let isValidate = false
            fieldValidation?.forEach((typeConstructor) => {
              if (
                Array.isArray(typeConstructor) &&
                typeConstructor !== undefined &&
                typeConstructor !== null
              ) {
                typeConstructor.forEach((object) => {
                  if (Array.isArray(listQueryValue)) {
                    listQueryValue?.forEach((queryValue: unknown) => {
                      if (object && new Object(queryValue) instanceof object) {
                        validatedListQueryValue.push(queryValue)
                        isValidate = true
                      } else if (
                        object === undefined &&
                        queryValue === undefined
                      ) {
                        validatedListQueryValue.push(undefined)
                        isValidate = true
                      } else if (object === null && queryValue === null) {
                        validatedListQueryValue.push(null)
                        isValidate = true
                      }
                    })
                  }
                })
              }
            })
            if (!isValidate) continue
          }

          filter?.[defaultLogical as keyof typeof filter]?.push({
            [field]: {
              [queryOpr]:
                validatedListQueryValue.length > 0
                  ? validatedListQueryValue
                  : listQueryValue
            }
          })
        } else if (
          queryOpr === Query.queryOperator._like &&
          (typeof value === 'string' || typeof value === 'number')
        ) {
          let parsedStrValue: string = this.parseNumberToString(value)
          const valueLen = parsedStrValue.length
          const lastSlashIndex: number = parsedStrValue.lastIndexOf('/')

          let flag = ''
          if (lastSlashIndex > -1 && lastSlashIndex < valueLen - 1) {
            flag = parsedStrValue.substring(lastSlashIndex + 1, valueLen)
            parsedStrValue = parsedStrValue.substring(0, lastSlashIndex)
          }
          const regexPattern = new RegExp(parsedStrValue, flag)

          filter?.[defaultLogical as keyof typeof filter]?.push({
            [field]: {
              [queryOpr]: regexPattern.toString()
            }
          })
        } else if (
          queryOpr === Query.queryOperator._q &&
          (typeof value === 'string' || typeof value === 'number')
        ) {
          const parsedStrValue: string = this.parseNumberToString(value)
          filter[queryOpr as keyof typeof filter] = {
            $search: parsedStrValue
          }
        }
      }

      // Conjunction
      const logicalOperator =
        Query.logicalOperator?.[operator as keyof typeof Query.logicalOperator]
      if (
        logicalOperator &&
        logicalOperator[
          value as unknown as keyof typeof Query.logicalOperator._conjunction
        ]
      ) {
        runtimeLogical =
          logicalOperator[
            value as unknown as keyof typeof Query.logicalOperator._conjunction
          ]
      }

      // Pagination
      const paginationOperator =
        Query.paginationOperator?.[
          operator as keyof typeof Query.paginationOperator
        ]
      if (paginationOperator) {
        if (!pagination) {
          pagination = {}
        }
        pagination[paginationOperator as keyof typeof pagination] = +value
      }

      // Sort
      const sortOpr =
        Query.sortOperator?.[operator as keyof typeof Query.sortOperator]
      if (sortOpr) {
        if (!sort) {
          sort = {}
        }
        const field = key.replace(operator, '')
        sort[field] = value as unknown as SortValue
      }

      // Projection
      const selectOpr =
        Query.selectOperator?.[operator as keyof typeof Query.selectOperator]
      if (selectOpr !== undefined && typeof value === 'string') {
        selection = value
          .replace(/\s/g, '')
          .split(',')
          .reduce(
            (previousValue, currentValue) =>
              currentValue
                ? { ...previousValue, [currentValue]: selectOpr }
                : previousValue,
            {}
          )
      }

      if (!selection) {
        const nSelectOpr =
          Query.notSelectOperator?.[
            operator as keyof typeof Query.notSelectOperator
          ]
        if (nSelectOpr !== undefined && typeof value === 'string') {
          notSelection = value
            .replace(/\s/g, '')
            .split(',')
            .reduce(
              (previousValue, currentValue) =>
                currentValue
                  ? { ...previousValue, [currentValue]: nSelectOpr }
                  : previousValue,
              {}
            )
        }
      }

      // Lookup
      const lookupOpr =
        Query.lookupOperator?.[operator as keyof typeof Query.lookupOperator]
      if (lookupOpr && typeof value === 'string') {
        if (!reference) {
          reference = {}
        }
        const localField = key.replace(operator, '')
        const as = value.trim()
        reference[localField] = as
      }
    }

    const isFilter: boolean =
      filter?.[defaultLogical as keyof typeof filter]?.length > 0

    if (runtimeLogical && isFilter) {
      filter = {
        [runtimeLogical]: filter?.[defaultLogical as keyof typeof filter]
      }
    }

    return {
      filter: isFilter ? filter : null,
      pagination,
      sort,
      projection: selection ? selection : notSelection,
      reference
    }
  }

  public mergeMongoDB(
    ...queries: {
      filter: Filter | null;
      sort: Sort | null;
      projection: Projection | null;
      pagination: Pagination | null;
      reference: Reference | null;
    }[]
  ): MongoDBQuery<
    Filter | null,
    Pagination | null,
    Sort | null,
    Projection | null,
    Reference | null
  > {
    return queries.reduce(
      (previousValue, currentValue) => ({
        filter:
          previousValue.filter || currentValue.filter
            ? { ...previousValue.filter, ...currentValue.filter }
            : null,

        pagination: currentValue.pagination
          ? currentValue.pagination
          : previousValue.pagination
          ? previousValue.pagination
          : null,

        sort:
          previousValue.sort || currentValue.sort
            ? { ...previousValue.sort, ...currentValue.sort }
            : null,

        projection: currentValue.projection
          ? currentValue.projection
          : previousValue.projection
          ? previousValue.projection
          : null,

        reference:
          previousValue.reference || currentValue.reference
            ? { ...previousValue.reference, ...currentValue.reference }
            : null
      }),
      {
        filter: null,
        sort: null,
        projection: null,
        pagination: null,
        reference: null
      }
    )
  }
}
