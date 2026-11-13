import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export function parseDdMmYyyy(value: string | undefined | null): Date | undefined {
  if (!value) {
    return undefined
  }
  const date = dayjs(value.trim(), ['DD-MM-YYYY', 'D-M-YYYY'], true)
  return date.isValid() ? date.toDate() : undefined
}

/** False for empty values and unfilled `<PLACEHOLDER>` config entries. */
export function isUsableUrl(url: string | undefined | null): boolean {
  return !!url && (/^https?:\/\//.test(url) || url.startsWith('/'))
}
