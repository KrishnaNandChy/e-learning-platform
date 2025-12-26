const Test = require('../models/Test');
const Question = require('../models/Question');
const TestResult = require('../models/TestResult');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Notification = require('../models/Notification');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../middlewares/errorHandler');
const { buildPaginationInfo, calculateTestScore } = require('../utils/helpers');

/**
 * @desc    Create a test
 * @route   POST /api/v1/tests
 * @access  Private/Instructor
 */
const createTest = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    courseId,
    lessonId,
    type,
    duration,
    passingMarks,
    negativeMarking,
    shuffleQuestions,
    shuffleOptions,
    attemptLimits,
    instructions,
    difficulty,
    availability
  } = req.body;

  // Verify course ownership
  const course = await Course.findById(courseId);
  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  const test = await Test.create({
    title,
    description,
    course: courseId,
    instructor: req.user._id,
    lesson: lessonId,
    type: type || 'quiz',
    duration,
    passingMarks: passingMarks || 40,
    negativeMarking: {
      enabled: negativeMarking?.enabled !== false, // MANDATORY - default true
      percentage: negativeMarking?.percentage || 25
    },
    shuffleQuestions,
    shuffleOptions,
    attemptLimits,
    instructions,
    difficulty,
    availability
  });

  // Update course
  course.hasQuiz = true;
  await course.save();

  return ApiResponse.created(res, { test }, 'Test created successfully');
});

/**
 * @desc    Get tests for a course
 * @route   GET /api/v1/tests/course/:courseId
 * @access  Private
 */
const getCourseTests = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { type } = req.query;

  const query = { course: courseId, isPublished: true };
  if (type) query.type = type;

  const tests = await Test.find(query)
    .select('-questions')
    .sort({ createdAt: 1 });

  // Get user's results for each test
  const testsWithResults = await Promise.all(tests.map(async (test) => {
    const results = await TestResult.find({
      user: req.user._id,
      test: test._id
    }).sort({ attemptNumber: -1 }).limit(1);

    return {
      ...test.toObject(),
      lastAttempt: results[0] || null,
      canAttempt: test.attemptLimits.maxAttempts === -1 ||
        !results[0] ||
        results.length < test.attemptLimits.maxAttempts
    };
  }));

  return ApiResponse.success(res, { tests: testsWithResults });
});

/**
 * @desc    Get single test
 * @route   GET /api/v1/tests/:id
 * @access  Private
 */
const getTest = asyncHandler(async (req, res, next) => {
  const test = await Test.findById(req.params.id)
    .populate('course', 'title slug instructor')
    .populate('lesson', 'title');

  if (!test) {
    return next(ApiError.notFound('Test not found'));
  }

  // Check if instructor or admin
  const isInstructor = test.instructor.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'admin_helper'].includes(req.user.role);

  // For students, don't include questions until they start
  let includeQuestions = isInstructor || isAdmin;

  if (!includeQuestions) {
    // Check enrollment
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: test.course._id,
      status: { $in: ['active', 'completed'] }
    });

    if (!enrollment && !test.isPublished) {
      return next(ApiError.forbidden('Not enrolled in this course'));
    }
  }

  // Get user's attempts
  const attempts = await TestResult.find({
    user: req.user._id,
    test: test._id
  }).sort({ attemptNumber: -1 });

  return ApiResponse.success(res, {
    test: includeQuestions ? test : { ...test.toObject(), questions: undefined },
    attempts,
    canAttempt: test.attemptLimits.maxAttempts === -1 ||
      attempts.length < test.attemptLimits.maxAttempts
  });
});

/**
 * @desc    Update test
 * @route   PUT /api/v1/tests/:id
 * @access  Private/Instructor
 */
const updateTest = asyncHandler(async (req, res, next) => {
  let test = await Test.findById(req.params.id);

  if (!test) {
    return next(ApiError.notFound('Test not found'));
  }

  if (test.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  const allowedFields = [
    'title', 'description', 'duration', 'passingMarks', 'negativeMarking',
    'shuffleQuestions', 'shuffleOptions', 'attemptLimits', 'instructions',
    'difficulty', 'availability', 'showResults', 'showCorrectAnswers',
    'isPublished', 'tags'
  ];

  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  // Ensure negative marking remains enabled (MANDATORY)
  if (updates.negativeMarking) {
    updates.negativeMarking.enabled = true;
  }

  test = await Test.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  return ApiResponse.success(res, { test }, 'Test updated');
});

/**
 * @desc    Add question to test
 * @route   POST /api/v1/tests/:id/questions
 * @access  Private/Instructor
 */
const addQuestion = asyncHandler(async (req, res, next) => {
  const {
    type,
    question,
    options,
    correctAnswer,
    explanation,
    marks,
    difficulty,
    topic,
    hint
  } = req.body;

  const test = await Test.findById(req.params.id);

  if (!test) {
    return next(ApiError.notFound('Test not found'));
  }

  if (test.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  const newQuestion = await Question.create({
    course: test.course,
    test: test._id,
    instructor: req.user._id,
    type,
    question,
    options,
    correctAnswer,
    explanation,
    marks: marks || 1,
    difficulty,
    topic,
    hint
  });

  // Add to test
  test.questions.push(newQuestion._id);
  test.totalQuestions = test.questions.length;
  test.totalMarks = await Question.aggregate([
    { $match: { _id: { $in: test.questions } } },
    { $group: { _id: null, total: { $sum: '$marks' } } }
  ]).then(result => result[0]?.total || 0);

  await test.save();

  return ApiResponse.created(res, { question: newQuestion, test }, 'Question added');
});

/**
 * @desc    Update question
 * @route   PUT /api/v1/tests/:testId/questions/:questionId
 * @access  Private/Instructor
 */
const updateQuestion = asyncHandler(async (req, res, next) => {
  const { testId, questionId } = req.params;

  const test = await Test.findById(testId);
  if (!test) {
    return next(ApiError.notFound('Test not found'));
  }

  if (test.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  let question = await Question.findById(questionId);
  if (!question) {
    return next(ApiError.notFound('Question not found'));
  }

  const allowedFields = [
    'type', 'question', 'options', 'correctAnswer', 'explanation',
    'marks', 'difficulty', 'topic', 'hint', 'isActive'
  ];

  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  question = await Question.findByIdAndUpdate(questionId, updates, {
    new: true,
    runValidators: true
  });

  // Update test total marks
  test.totalMarks = await Question.aggregate([
    { $match: { _id: { $in: test.questions } } },
    { $group: { _id: null, total: { $sum: '$marks' } } }
  ]).then(result => result[0]?.total || 0);

  await test.save();

  return ApiResponse.success(res, { question }, 'Question updated');
});

/**
 * @desc    Delete question
 * @route   DELETE /api/v1/tests/:testId/questions/:questionId
 * @access  Private/Instructor
 */
const deleteQuestion = asyncHandler(async (req, res, next) => {
  const { testId, questionId } = req.params;

  const test = await Test.findById(testId);
  if (!test) {
    return next(ApiError.notFound('Test not found'));
  }

  if (test.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  await Question.findByIdAndDelete(questionId);

  // Remove from test
  test.questions = test.questions.filter(q => q.toString() !== questionId);
  test.totalQuestions = test.questions.length;
  test.totalMarks = await Question.aggregate([
    { $match: { _id: { $in: test.questions } } },
    { $group: { _id: null, total: { $sum: '$marks' } } }
  ]).then(result => result[0]?.total || 0);

  await test.save();

  return ApiResponse.success(res, null, 'Question deleted');
});

/**
 * @desc    Start test attempt
 * @route   POST /api/v1/tests/:id/start
 * @access  Private
 */
const startTest = asyncHandler(async (req, res, next) => {
  const test = await Test.findById(req.params.id)
    .populate('questions');

  if (!test) {
    return next(ApiError.notFound('Test not found'));
  }

  if (!test.isPublished) {
    return next(ApiError.badRequest('Test is not available'));
  }

  if (!test.isAvailable()) {
    return next(ApiError.badRequest('Test is not available at this time'));
  }

  // Check enrollment
  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: test.course,
    status: { $in: ['active', 'completed'] }
  });

  if (!enrollment) {
    return next(ApiError.forbidden('Not enrolled in this course'));
  }

  // Check attempt limits
  const previousAttempts = await TestResult.countDocuments({
    user: req.user._id,
    test: test._id
  });

  if (test.attemptLimits.maxAttempts !== -1 && 
      previousAttempts >= test.attemptLimits.maxAttempts) {
    return next(ApiError.badRequest('Maximum attempts reached'));
  }

  // Check cooldown period
  if (test.attemptLimits.cooldownPeriod > 0 && previousAttempts > 0) {
    const lastAttempt = await TestResult.findOne({
      user: req.user._id,
      test: test._id
    }).sort({ createdAt: -1 });

    const cooldownEnd = new Date(lastAttempt.submittedAt || lastAttempt.createdAt);
    cooldownEnd.setHours(cooldownEnd.getHours() + test.attemptLimits.cooldownPeriod);

    if (new Date() < cooldownEnd) {
      return next(ApiError.badRequest(`Please wait ${test.attemptLimits.cooldownPeriod} hours between attempts`));
    }
  }

  // Create test result
  const testResult = await TestResult.create({
    user: req.user._id,
    test: test._id,
    course: test.course,
    enrollment: enrollment._id,
    attemptNumber: previousAttempts + 1,
    status: 'in_progress',
    answers: test.questions.map(q => ({
      question: q._id,
      selectedAnswer: null,
      isCorrect: null,
      marksObtained: null
    }))
  });

  // Prepare questions (shuffle if needed)
  let questions = test.questions.map(q => ({
    _id: q._id,
    type: q.type,
    question: q.question,
    questionImage: q.questionImage,
    options: test.shuffleOptions 
      ? shuffleArray([...q.options.map(o => ({ text: o.text, image: o.image }))])
      : q.options.map(o => ({ text: o.text, image: o.image })),
    marks: q.marks,
    difficulty: q.difficulty,
    hint: q.hint
  }));

  if (test.shuffleQuestions) {
    questions = shuffleArray(questions);
  }

  return ApiResponse.success(res, {
    testResult: {
      _id: testResult._id,
      attemptNumber: testResult.attemptNumber,
      startedAt: testResult.startedAt
    },
    test: {
      _id: test._id,
      title: test.title,
      duration: test.duration,
      totalQuestions: test.totalQuestions,
      totalMarks: test.totalMarks,
      negativeMarking: test.negativeMarking,
      instructions: test.instructions
    },
    questions
  }, 'Test started');
});

/**
 * @desc    Submit test
 * @route   POST /api/v1/tests/:id/submit
 * @access  Private
 */
const submitTest = asyncHandler(async (req, res, next) => {
  const { resultId, answers, timeTaken } = req.body;

  const testResult = await TestResult.findById(resultId);
  if (!testResult) {
    return next(ApiError.notFound('Test attempt not found'));
  }

  if (testResult.user.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  if (testResult.status !== 'in_progress') {
    return next(ApiError.badRequest('Test already submitted'));
  }

  const test = await Test.findById(testResult.test);

  // Update answers
  for (const answer of answers) {
    const existingAnswer = testResult.answers.find(
      a => a.question.toString() === answer.questionId
    );
    if (existingAnswer) {
      existingAnswer.selectedAnswer = answer.selectedAnswer;
      existingAnswer.timeTaken = answer.timeTaken;
    }
  }

  testResult.submittedAt = new Date();
  testResult.timeTaken = timeTaken || Math.floor((testResult.submittedAt - testResult.startedAt) / 1000);
  testResult.status = 'submitted';

  // Calculate score with MANDATORY negative marking
  await testResult.calculateScore(test.negativeMarking.percentage);

  // Check if passed
  await testResult.checkPassed(test.passingMarks);

  // Calculate rank
  await testResult.calculateRank();

  // Analyze performance
  await testResult.analyzePerformance();

  // Update test statistics
  await test.updateStats(testResult.score.percentage);

  // Update question statistics
  for (const answer of testResult.answers) {
    const question = await Question.findById(answer.question);
    if (question) {
      await question.updateStats(answer.isCorrect, answer.timeTaken || 0);
    }
  }

  // Notify user
  await Notification.createNotification(
    req.user._id,
    'test_result',
    `Test Results: ${test.title}`,
    `You scored ${testResult.score.percentage}% (${testResult.passed ? 'Passed' : 'Failed'})`,
    { testId: test._id, resultId: testResult._id, link: `/tests/${test._id}/results/${testResult._id}` }
  );

  return ApiResponse.success(res, {
    result: testResult,
    showCorrectAnswers: test.showCorrectAnswers
  }, 'Test submitted successfully');
});

/**
 * @desc    Get test result
 * @route   GET /api/v1/tests/:testId/results/:resultId
 * @access  Private
 */
const getTestResult = asyncHandler(async (req, res, next) => {
  const { testId, resultId } = req.params;

  const testResult = await TestResult.findById(resultId)
    .populate({
      path: 'answers.question',
      select: 'question options correctAnswer explanation marks difficulty topic'
    });

  if (!testResult) {
    return next(ApiError.notFound('Result not found'));
  }

  // Check authorization
  const isOwner = testResult.user.toString() === req.user._id.toString();
  const test = await Test.findById(testId).populate('course', 'instructor');
  const isInstructor = test.course.instructor.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'admin_helper'].includes(req.user.role);

  if (!isOwner && !isInstructor && !isAdmin) {
    return next(ApiError.forbidden('Not authorized'));
  }

  return ApiResponse.success(res, {
    result: testResult,
    test: {
      title: test.title,
      showCorrectAnswers: test.showCorrectAnswers || isInstructor || isAdmin
    }
  });
});

/**
 * @desc    Get leaderboard
 * @route   GET /api/v1/tests/:id/leaderboard
 * @access  Private
 */
const getLeaderboard = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;

  const test = await Test.findById(req.params.id);
  if (!test) {
    return next(ApiError.notFound('Test not found'));
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get best attempt per user
  const leaderboard = await TestResult.aggregate([
    { $match: { test: test._id, status: 'submitted' } },
    { $sort: { 'score.obtainedMarks': -1, timeTaken: 1 } },
    {
      $group: {
        _id: '$user',
        bestScore: { $first: '$score.obtainedMarks' },
        percentage: { $first: '$score.percentage' },
        timeTaken: { $first: '$timeTaken' },
        submittedAt: { $first: '$submittedAt' }
      }
    },
    { $sort: { bestScore: -1, timeTaken: 1 } },
    { $skip: skip },
    { $limit: parseInt(limit) }
  ]);

  // Populate user info
  const User = require('../models/User');
  const populatedLeaderboard = await Promise.all(
    leaderboard.map(async (entry, index) => {
      const user = await User.findById(entry._id).select('name avatar');
      return {
        rank: skip + index + 1,
        user: user,
        score: entry.bestScore,
        percentage: entry.percentage,
        timeTaken: entry.timeTaken
      };
    })
  );

  // Get user's rank
  let userRank = null;
  if (req.user) {
    const userBest = await TestResult.findOne({
      test: test._id,
      user: req.user._id,
      status: 'submitted'
    }).sort({ 'score.obtainedMarks': -1 });

    if (userBest) {
      userRank = {
        rank: userBest.rank,
        score: userBest.score.obtainedMarks,
        percentage: userBest.score.percentage
      };
    }
  }

  return ApiResponse.success(res, {
    leaderboard: populatedLeaderboard,
    userRank,
    totalAttempts: test.totalAttempts
  });
});

/**
 * @desc    Delete test
 * @route   DELETE /api/v1/tests/:id
 * @access  Private/Instructor
 */
const deleteTest = asyncHandler(async (req, res, next) => {
  const test = await Test.findById(req.params.id);

  if (!test) {
    return next(ApiError.notFound('Test not found'));
  }

  if (test.instructor.toString() !== req.user._id.toString() &&
      !['admin'].includes(req.user.role)) {
    return next(ApiError.forbidden('Not authorized'));
  }

  // Delete associated questions
  await Question.deleteMany({ test: test._id });

  // Delete results
  await TestResult.deleteMany({ test: test._id });

  await test.deleteOne();

  return ApiResponse.success(res, null, 'Test deleted');
});

// Helper function
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

module.exports = {
  createTest,
  getCourseTests,
  getTest,
  updateTest,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  startTest,
  submitTest,
  getTestResult,
  getLeaderboard,
  deleteTest
};
