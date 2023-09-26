const { createErrorResponse, createSuccessResponse } = require('../../src/response');

describe('API Responses', () => {
  // test for calling createErrorResponse()
  test('createErrorResponse()', () => {
    const errorResponse = createErrorResponse(404, 'not found');
    // Expect the result to look like the following
    expect(errorResponse).toEqual({
      status: 'error',
      error: {
        code: 404,
        message: 'not found',
      },
    });
  });

  // test for calling createSuccessResponse() with no argument
  test('createSuccessResponse()', () => {
    // No arg passed
    const successResponse = createSuccessResponse();
    // Expect the result to look like the following
    expect(successResponse).toEqual({
      status: 'ok',
    });
  });

  // Write a test for calling createSuccessResponse() with an argument
  test('createSuccessResponse(data)', () => {
    // Data argument included
    const data = { a: 1, b: 2 };
    const successResponse = createSuccessResponse(data);
    // Expect the result to look like the following
    expect(successResponse).toEqual({
      status: 'ok',
      a: 1,
      b: 2,
    });
  });
});
