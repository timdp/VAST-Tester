export const ADID_VALIDATION_SUCCEEDED = 'ADID_VALIDATION_SUCCEEDED'
export const ADID_VALIDATION_FAILED = 'ADID_VALIDATION_FAILED'
export const ADID_VALIDATION_REQUEST_FAILED = 'ADID_VALIDATION_REQUEST_FAILED'

export const adIdValidationSucceeded = adId => ({
  type: ADID_VALIDATION_SUCCEEDED,
  payload: { adId }
})

export const adIdValidationFailed = adId => ({
  type: ADID_VALIDATION_FAILED,
  payload: { adId }
})

export const adIdValidationRequestFailed = (adId, errorMessage) => ({
  type: ADID_VALIDATION_REQUEST_FAILED,
  payload: { adId, errorMessage }
})
