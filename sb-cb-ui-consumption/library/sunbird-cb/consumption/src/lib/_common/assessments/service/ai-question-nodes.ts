/**
 * Turns the questions of a completed AI generation job into question nodes built the same way
 * assessment-question-list's saveQuestion builds one, so they save through the same hierarchy update.
 */

export interface IAiQuestionsContext {
  /** 6 for basic assessments, which fill FTB blanks in order instead of assigning them. */
  compatibilityLevel?: number
  /** The section's levels keyed by name (Easy, Medium...), which give each question its marks. */
  sectionLevelDefinition?: Record<string, { marksForQuestion?: number }> | null
}

export interface IAiQuestionNodes {
  /** New question nodes keyed by their generated identifier, in the job's question order: the shape nodesModified takes. */
  nodes: Record<string, any>
  /** Questions that fail the checks a question written by hand must pass before it can be saved. */
  skipped: Array<{ questionId: string, reason: string }>
}

interface IQuestionContent {
  body: string
  answer: string
  /** Each option's text and what the editor stores as its answer: correctness, blank or matching text. */
  options: Array<{ answer: any, body: string }>
  rhsChoices: string[]
}

const BASIC_COMPATIBILITY_LEVEL = 6
/** A blank as the editor saves it once it has normalised the style. */
const BLANK_MARKUP = '<input style="border-style:none none solid none;">'
/** How the AI marks a blank in FTB question text. */
const BLANK_PATTERN = /_{3,}|<blank>|\[blank\]/gi
/** The AI's question_type, letters only, to the qType the editor uses. */
const QTYPES: Record<string, string> = {
  MCQ: 'MCQ-SCA',
  MULTICHOICE: 'MCQ-MCA',
  FTB: 'FTB',
  MTF: 'MTF',
  TRUEFALSE: 'MCQ-SCA-TF',
  TF: 'MCQ-SCA-TF',
}
/** The group a question is listed under, for when its question_type is missing. */
const GROUP_QTYPES: Record<string, string> = {
  'Multiple Choice Question': 'MCQ-SCA',
  'Multi-Choice Question': 'MCQ-MCA',
  'FTB Question': 'FTB',
  'MTF Question': 'MTF',
  'True/False Question': 'MCQ-SCA-TF',
}
const PRIMARY_CATEGORIES: Record<string, string> = {
  FTB: 'FTB Question',
  MTF: 'MTF Question',
}
/** The AI's difficulty to the level names sections set marks for. */
const LEVELS: Record<string, string> = {
  beginner: 'Easy',
  intermediate: 'Medium',
  advanced: 'Difficult',
}
const DEFAULT_LEVEL = 'Easy'

export function buildAiQuestionNodes(
  response: any, context: IAiQuestionsContext, generateId: () => string
): IAiQuestionNodes {
  const result: IAiQuestionNodes = { nodes: {}, skipped: [] }
  orderedQuestions(response?.assessment_data).forEach(({ question, qType }) => {
    try {
      const metadata = buildMetadata(question, qType, context)
      result.nodes[generateId()] = { isNew: true, root: false, metadata, objectType: 'Question' }
    } catch (error) {
      result.skipped.push({ questionId: question?.question_id || '', reason: (error as Error).message })
    }
  })
  return result
}

/** Every generated question with its qType, in the job's question_order, then any it leaves out. */
function orderedQuestions(assessmentData: any): Array<{ question: any, qType: string }> {
  const listed: Array<{ question: any, qType: string }> = []
  Object.entries(assessmentData?.questions || {}).forEach(([group, questions]) => {
    toArray(questions).forEach(question => {
      const qType = QTYPES[String(question?.question_type || '').toUpperCase().replace(/[^A-Z]/g, '')]
        || GROUP_QTYPES[group]
      listed.push({ question, qType })
    })
  })
  const order: string[] = toArray(assessmentData?.question_order)
  const position = (id: string) => order.includes(id) ? order.indexOf(id) : order.length
  return listed.sort((a, b) => position(a.question?.question_id) - position(b.question?.question_id))
}

function buildMetadata(question: any, qType: string, context: IAiQuestionsContext): any {
  const content = buildContent(question, qType, context.compatibilityLevel === BASIC_COMPATIBILITY_LEVEL)
  const level = LEVELS[String(question.difficulty_level || '').toLowerCase()] || DEFAULT_LEVEL
  return {
    code: 'question',
    mimeType: 'application/vnd.sunbird.question',
    body: content.body,
    primaryCategory: PRIMARY_CATEGORIES[qType] || 'Multiple Choice Question',
    qType,
    editorState: {
      options: content.options.map((option, index) => ({ answer: option.answer, value: { body: option.body, value: index } })),
      question: content.body,
    },
    objectType: 'Question',
    answer: content.answer,
    name: content.body,
    choices: {
      options: content.options.map((option, index) => ({ value: { body: option.body, value: index } })),
    },
    rhsChoices: content.rhsChoices,
    compatibilityLevel: context.compatibilityLevel,
    questionLevel: level,
    totalMarks: context.sectionLevelDefinition?.[level]?.marksForQuestion || 0,
  }
}

function buildContent(question: any, qType: string, isBasic: boolean): IQuestionContent {
  switch (qType) {
    case 'MCQ-SCA':
    case 'MCQ-MCA':
    case 'MCQ-SCA-TF':
      return choiceContent(question, qType)
    case 'FTB':
      return blankContent(question, isBasic)
    case 'MTF':
      return pairContent(question)
    default:
      throw new Error(`Question type "${question?.question_type}" is not supported.`)
  }
}

function choiceContent(question: any, qType: string): IQuestionContent {
  const isTrueFalse = qType === 'MCQ-SCA-TF'
  const options = choiceOptions(question, isTrueFalse)
  const correct = options.map((option, index) => option.isCorrect ? String(index) : '').filter(Boolean)
  if (options.length < 2 || options.some(option => !option.text)) {
    throw new Error('It needs at least two options, each with text.')
  }
  if (qType === 'MCQ-MCA' ? correct.length < 2 : correct.length !== 1) {
    throw new Error(qType === 'MCQ-MCA' ? 'It needs at least two correct options.' : 'It needs exactly one correct option.')
  }
  return {
    body: toHtml(question.question_text),
    answer: correct.join(','),
    // True/False options are stored as plain True and False, the others as the editor's HTML
    options: options.map(option => ({ answer: option.isCorrect, body: isTrueFalse ? option.text : toHtml(option.text) })),
    rhsChoices: [],
  }
}

/** The options in their index order, marked with whether correct_option_index names them. */
function choiceOptions(question: any, isTrueFalse: boolean): Array<{ text: string, isCorrect: boolean }> {
  const correctIndexes = toArray(question.correct_option_index).map(Number)
  if (isTrueFalse && !toArray(question.options).length) {
    const isTrue = String(question.correct_answer).trim().toLowerCase() === 'true'
    return [{ text: 'True', isCorrect: isTrue }, { text: 'False', isCorrect: !isTrue }]
  }
  return indexedOptions(question).map(option => ({ text: option.text, isCorrect: correctIndexes.includes(option.index) }))
}

function blankContent(question: any, isBasic: boolean): IQuestionContent {
  const segments = String(question.question_text || '').trim().split(BLANK_PATTERN)
  const blankCount = segments.length - 1
  if (!blankCount) {
    throw new Error('Its text has no blank.')
  }
  const choices = blankChoices(question)
  const answers = choices.filter(choice => choice.blank).sort((a, b) => a.blank - b.blank)
  if (answers.length !== blankCount || choices.some(choice => !choice.text)) {
    throw new Error(`It has ${blankCount} blanks but ${answers.length} answers.`)
  }
  // Basic assessments take only the answers and fill the blanks in order; the others keep the
  // distractors too, with each answer naming the blank it fills
  const options = isBasic ? answers : choices
  return {
    body: `<p>${segments.map(segment => escapeHtml(segment)).join(BLANK_MARKUP)}</p>`,
    answer: answers.map(answer => String(options.indexOf(answer))).join(','),
    options: options.map(choice => ({
      answer: isBasic ? true : choice.blank ? `B${choice.blank}` : 'none',
      body: choice.text,
    })),
    rhsChoices: [],
  }
}

/**
 * Each option with the blank it fills, counted from 1, or 0 for a distractor. The answers come from
 * correct_option_index, in blank order, or from correct_answer when the AI gives no options.
 */
function blankChoices(question: any): Array<{ text: string, blank: number }> {
  if (!toArray(question.options).length) {
    return toArray(question.correct_answer).map((answer, index) => ({ text: String(answer).trim(), blank: index + 1 }))
  }
  const correctIndexes = toArray(question.correct_option_index).map(Number)
  return indexedOptions(question).map(option => ({ text: option.text, blank: correctIndexes.indexOf(option.index) + 1 }))
}

/** The options in the order of their index, which correct_option_index refers to. */
function indexedOptions(question: any): Array<{ text: string, index: number }> {
  return toArray(question.options)
    .map((option, position) => ({
      text: String(option?.text || '').trim(),
      index: Number.isFinite(option?.index) ? option.index : position,
    }))
    .sort((a, b) => a.index - b.index)
}

function pairContent(question: any): IQuestionContent {
  const pairs = toArray(question.pairs).map(pair => ({
    left: String(pair?.left || '').trim(),
    right: String(pair?.right || '').trim(),
  }))
  if (pairs.length < 2 || pairs.some(pair => !pair.left || !pair.right)) {
    throw new Error('It needs at least two pairs, each with both sides.')
  }
  return {
    body: toHtml(question.matching_context || question.question_text),
    answer: pairs.map((_, index) => String(index)).join(','),
    options: pairs.map(pair => ({ answer: toHtml(pair.right), body: toHtml(pair.left) })),
    rhsChoices: pairs.map(pair => toHtml(pair.right)),
  }
}

/** Text as the editor would hold it, failing when there is none. */
function toHtml(text: any): string {
  const trimmed = String(text || '').trim()
  if (!trimmed) {
    throw new Error('It has no question or option text.')
  }
  return `<p>${escapeHtml(trimmed)}</p>`
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function toArray(value: any): any[] {
  if (Array.isArray(value)) {
    return value
  }
  return value === undefined || value === null ? [] : [value]
}
