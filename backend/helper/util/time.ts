interface Timer {
  idle(t: number): Promise<unknown>
  parse(t: number, u: TimeUnit): Date
  toUnix(d?: Date): number
  toISO(d?: Date): string
  stamp(o?: TimestampOptions, d?: Date): Date
  format(p: string, d?: Date): string
}

interface TimestampOptions {
  milliseconds?: number
  seconds?: number
  minutes?: number
  hours?: number
  date?: number
  month?: number
  year?: number
}

type TimeUnit = 'milliseconds'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'date'
  | 'month'
  | 'year'

type WeekdayPattern = Record<number, Record<'WDL' | 'WDS3' | 'WDS2', string>>
type MonthPattern = Record<number, Record<'MOL' | 'MOS3' | 'mmo' | 'mo', string>>
type DatePattern = Record<number, Record<'DL' | 'dd' | 'd', string>>
type HourPattern = Record<number, Record<'hh24' | 'h24' | 'hh12' | 'h12', string>>
type MinutePattern = Record<number, Record<'mmin' | 'min', string>>
type SecondPattern = Record<number, Record<'ss' | 's', string>>

export class Time implements Timer {
  private static instance: Time
  private static milliseconds: number = 1
  private static seconds: number = Time.milliseconds * 1000
  private static minutes: number = Time.seconds * 60
  private static hours: number = Time.minutes * 60
  private static date: number = Time.hours * 24
  private static month: number = Time.date * 30
  private static year: number = Time.date * 365
  private static weekdayPattern: WeekdayPattern = {}
  private static monthPattern: MonthPattern = {}
  private static datePattern: DatePattern = {}
  private static hourPattern: HourPattern = {}
  private static minutePattern: MinutePattern = {}
  private static secondPattern: SecondPattern = {}
  private static formatPatternRegex = new RegExp(
    /WDL|WDS2|WDS3|yyyy|MOL|MOS3|mmo|mo|DL|dd|d|hh24|h24|hh12|h12|mmin|min|ss|s/,
    'g'
  )
  private static ordinalSuffix: string[] = [
    'th',
    'st',
    'nd',
    'rd'
  ]
  private static dayInWeek: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]
  private static monthInYear: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  private static getOrdinal(num: number): string {
    const val = num % 100
    return num + (Time.ordinalSuffix[(val - 20) % 10]
      || Time.ordinalSuffix[val]
      || Time.ordinalSuffix[0])
  }

  public static getInstance(): Time {
    if (!Time.instance) {
      Time.weekdayPattern = Time.dayInWeek.reduce(
        (previousValue, currentValue, index) => {
          previousValue[index] = {
            WDL: currentValue,
            WDS3: currentValue.substring(0, 3),
            WDS2: currentValue.substring(0, 2)
          }
          return previousValue
        }, {}
      )

      Time.monthPattern = Time.monthInYear.reduce(
        (previousValue, currentValue, index) => {
          previousValue[index] = {
            MOL: currentValue,
            MOS3: currentValue.substring(0, 3),
            mmo: `${index + 1}`.padStart(2, '0'),
            mo: `${index + 1}`
          }
          return previousValue
        }, {}
      )

      for (let i = 0; i <= 59; i++) {

        // For hours
        if (i <= 23) {
          const hour24 = i
          const hour12 = hour24 > 12 ? hour24 - 12 : hour24
          Time.hourPattern[hour24] = {
            hh24: hour24.toString().padStart(2, '0'),
            h24: hour24.toString(),
            hh12: hour12.toString().padStart(2, '0'),
            h12: hour12.toString()
          }
        }

        // For dates
        if (i < 31) {
          const date = i + 1
          Time.datePattern[date] = {
            DL: Time.getOrdinal(date),
            dd: date.toString().padStart(2, '0'),
            d: date.toString()
          }
        }

        // For minutes
        Time.minutePattern[i] = {
          mmin: i.toString().padStart(2, '0'),
          min: i.toString()
        }

        // For seconds
        Time.secondPattern[i] = {
          ss: i.toString().padStart(2, '0'),
          s: i.toString()
        }
      }

      Time.instance = new Time()
    }
    return Time.instance
  }

  public idle = async (sec: number) =>
    new Promise((resolve) =>
      setTimeout(resolve, sec * 1000))

  public parse = (time: number, timeUnit: TimeUnit) =>
    new Date(time * Time[timeUnit])

  public toUnix = (date: Date = new Date()): number =>
    date.getTime() / 1000 | 0

  public toISO = (date: Date = new Date()): string => {
    const timezoneOffset = date.getTimezoneOffset()
    const isTimezonePositive = timezoneOffset > 0
    const localeDate = this.stamp({ minutes: -timezoneOffset }, date)
    const opr = isTimezonePositive ? '-' : '+'
    const timezone = (Math.abs(timezoneOffset) / 60).toString().padStart(2, '0')
    return localeDate.toISOString().split('.').shift() + opr + timezone + ':' + '00'
  }

  public stamp = (options?: TimestampOptions, date = new Date()): Date => {
    let nowMs: number = date.getTime()
    for (const timeUnit in options) {
      const timeValue = options[timeUnit]
      nowMs += timeValue * Time[timeUnit]
    }
    return new Date(nowMs)
  }

  public format = (pattern: string, date = new Date()): string => {
    const weekday = date.getDay()
    const fullYear = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const yeadObj = { yyyy: fullYear.toString() }

    return pattern.replace(Time.formatPatternRegex, (matchedValue: string) =>
      Time.weekdayPattern?.[weekday]?.[matchedValue]
      || yeadObj?.[matchedValue]
      || Time?.monthPattern?.[month]?.[matchedValue]
      || Time?.datePattern?.[day]?.[matchedValue]
      || Time?.hourPattern?.[hour]?.[matchedValue]
      || Time?.minutePattern?.[minute]?.[matchedValue]
      || Time?.secondPattern?.[second]?.[matchedValue]
    )
  }
}