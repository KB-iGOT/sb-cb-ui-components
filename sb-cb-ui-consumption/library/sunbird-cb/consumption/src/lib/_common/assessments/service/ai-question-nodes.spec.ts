import { buildAiQuestionNodes } from './ai-question-nodes';

const BLANK = '<input style="border-style:none none solid none;">';

/** A trimmed status response holding one question of each type the AI returned. */
const response = {
  status: 'COMPLETED',
  assessment_data: {
    questions: {
      'Multiple Choice Question': [{
        question_id: 'MCQ_001',
        question_type: 'MCQ',
        question_text: 'Which command shows the configuration file in use?',
        options: [{ text: 'nginx -s stop', index: 0 }, { text: 'nginx -t', index: 1 }],
        correct_option_index: 1,
        difficulty_level: 'intermediate',
      }],
      'FTB Question': [{
        question_id: 'FTB_001',
        question_type: 'FTB',
        question_text: 'Use the __________ signal to reload the configuration.',
        correct_answer: 'HUP',
        difficulty_level: 'intermediate',
      }],
      'MTF Question': [{
        question_id: 'MTF_001',
        question_type: 'MTF',
        matching_context: 'Match the command with its function.',
        pairs: [{ left: 'nginx.conf', right: 'Primary configuration file' }, { left: 'nginx -t', right: 'Syntax check' }],
        difficulty_level: 'intermediate',
      }],
      'Multi-Choice Question': [{
        question_id: 'MULTICHOICE_001',
        question_type: 'MULTICHOICE',
        question_text: 'Which settings affect performance? (Select all that apply)',
        options: [{ text: 'Timeouts', index: 0 }, { text: 'Rate limiting', index: 1 }, { text: 'Rack color', index: 2 }],
        correct_option_index: [0, 1],
        difficulty_level: 'intermediate',
      }],
      'True/False Question': [],
    },
    question_order: ['FTB_001', 'MTF_001', 'MULTICHOICE_001', 'MCQ_001'],
  },
};

function build(source: any, context: any = { compatibilityLevel: 6 }) {
  let count = 0;
  return buildAiQuestionNodes(source, context, () => `q${++count}`);
}

describe('buildAiQuestionNodes', () => {
  it('should build each question the way saving a single question does, in the response question order', () => {
    const { nodes, skipped } = build(response);

    expect(skipped).toEqual([]);
    expect(Object.keys(nodes)).toEqual(['q1', 'q2', 'q3', 'q4']);
    expect(Object.values(nodes).map(node => [node.metadata.qType, node.metadata.answer])).toEqual([
      ['FTB', '0'], ['MTF', '0,1'], ['MCQ-MCA', '0,1'], ['MCQ-SCA', '1'],
    ]);
  });

  it('should turn the blank into the editor blank, and fill blanks in order for basic assessments', () => {
    const body = `<p>Use the ${BLANK} signal to reload the configuration.</p>`;

    expect(build(response).nodes['q1']).toEqual({
      isNew: true,
      root: false,
      metadata: {
        code: 'question',
        mimeType: 'application/vnd.sunbird.question',
        body,
        primaryCategory: 'FTB Question',
        qType: 'FTB',
        editorState: { options: [{ answer: true, value: { body: 'HUP', value: 0 } }], question: body },
        objectType: 'Question',
        answer: '0',
        name: body,
        choices: { options: [{ value: { body: 'HUP', value: 0 } }] },
        rhsChoices: [],
        compatibilityLevel: 6,
        questionLevel: 'Medium',
        totalMarks: 0,
      },
      objectType: 'Question',
    });
  });

  it('should keep the matching pairs and mark the correct options', () => {
    const { nodes } = build(response);

    expect(nodes['q2'].metadata.editorState.options[1]).toEqual({ answer: '<p>Syntax check</p>', value: { body: '<p>nginx -t</p>', value: 1 } });
    expect(nodes['q2'].metadata.rhsChoices).toEqual(['<p>Primary configuration file</p>', '<p>Syntax check</p>']);
    expect(nodes['q3'].metadata.editorState.options.map((option: any) => option.answer)).toEqual([true, true, false]);
    expect(nodes['q4'].metadata.choices.options[1]).toEqual({ value: { body: '<p>nginx -t</p>', value: 1 } });
  });

  it('should name the blank each answer fills for advanced assessments, and take marks from the section level', () => {
    const source = { assessment_data: { questions: { 'FTB Question': [{
      question_type: 'FTB', question_text: 'A ____ and a ____.', correct_answer: ['x', 'y'], difficulty_level: 'advanced',
    }] } } };

    const metadata = build(source, { compatibilityLevel: 5, sectionLevelDefinition: { Difficult: { marksForQuestion: 4 } } })
      .nodes['q1'].metadata;

    expect(metadata.editorState.options.map((option: any) => option.answer)).toEqual(['B1', 'B2']);
    expect(metadata.answer).toBe('0,1');
    expect([metadata.questionLevel, metadata.totalMarks]).toEqual(['Difficult', 4]);
  });

  describe('fill in the blanks given as options with a correct option', () => {
    // As the AI returns them since prompt version 7: the answer among distractors
    const source = { assessment_data: { questions: { 'FTB Question': [{
      question_id: 'q_c26cd19fc299', question_type: 'FTB',
      question_text: 'A project manager must adopt an appropriate ___ to facilitate effective communication.',
      options: [
        { text: 'technical architecture', index: 0 }, { text: 'financial budget', index: 1 },
        { text: 'punitive mandate', index: 2 }, { text: 'leadership style', index: 3 },
      ],
      correct_option_index: 3,
      difficulty_level: 'intermediate',
    }] } } };

    it('should keep only the answer for basic assessments', () => {
      const { nodes, skipped } = build(source);

      const metadata = nodes['q1'].metadata;
      expect(skipped).toEqual([]);
      expect(metadata.body).toBe(`<p>A project manager must adopt an appropriate ${BLANK} to facilitate effective communication.</p>`);
      expect(metadata.editorState.options).toEqual([{ answer: true, value: { body: 'leadership style', value: 0 } }]);
      expect(metadata.choices.options).toEqual([{ value: { body: 'leadership style', value: 0 } }]);
      expect(metadata.answer).toBe('0');
    });

    it('should keep the distractors, assigned to no blank, for advanced assessments', () => {
      const metadata = build(source, { compatibilityLevel: 5 }).nodes['q1'].metadata;

      expect(metadata.editorState.options.map((option: any) => [option.value.body, option.answer])).toEqual([
        ['technical architecture', 'none'], ['financial budget', 'none'], ['punitive mandate', 'none'], ['leadership style', 'B1'],
      ]);
      expect(metadata.answer).toBe('3');
    });
  });

  it('should build True/False from the correct answer and escape the text', () => {
    const source = { assessment_data: { questions: { 'True/False Question': [{ question_text: 'Is 1 < 2?', correct_answer: false }] } } };

    const metadata = build(source).nodes['q1'].metadata;

    expect(metadata.qType).toBe('MCQ-SCA-TF');
    expect(metadata.body).toBe('<p>Is 1 &lt; 2?</p>');
    expect(metadata.editorState.options).toEqual([
      { answer: false, value: { body: 'True', value: 0 } },
      { answer: true, value: { body: 'False', value: 1 } },
    ]);
    expect(metadata.answer).toBe('1');
  });

  it('should leave out questions that could not be saved by hand', () => {
    const source = { assessment_data: { questions: {
      'FTB Question': [{ question_id: 'F1', question_type: 'FTB', question_text: 'No blank here', correct_answer: 'x' }],
      'Multi-Choice Question': [{
        question_id: 'M1', question_type: 'MULTICHOICE', question_text: 'Pick',
        options: [{ text: 'a', index: 0 }, { text: 'b', index: 1 }], correct_option_index: [1],
      }],
      'Weightage Question': [{ question_id: 'W1', question_type: 'MCQ_WEIGHTAGE', question_text: 'Rate' }],
    } } };

    const { nodes, skipped } = build(source);

    expect(nodes).toEqual({});
    expect(skipped).toEqual([
      { questionId: 'F1', reason: 'Its text has no blank.' },
      { questionId: 'M1', reason: 'It needs at least two correct options.' },
      { questionId: 'W1', reason: 'Question type "MCQ_WEIGHTAGE" is not supported.' },
    ]);
  });
});
