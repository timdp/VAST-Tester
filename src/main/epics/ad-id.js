import { ofType } from 'redux-observable'
import { from as _from, of as _of } from 'rxjs'
import { catchError, map, mergeMap, takeUntil } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'
import {
  END_TEST,
  VAST_LOADED,
  adIdValidationSucceeded,
  adIdValidationFailed,
  adIdValidationRequestFailed
} from '../actions'

const adIdValidationEpic = action$ =>
  action$.pipe(
    ofType(VAST_LOADED),
    mergeMap(({ payload: { chain } }) => {
      const { xml } = chain[chain.length - 1]
      const doc = new DOMParser().parseFromString(xml, 'text/xml')
      const adIds = Array.from(doc.querySelectorAll('UniversalAdId')).map(
        elem => elem.textContent.trim()
      )
      // TODO Remove
      if (adIds.length === 0) {
        adIds.push('f1c2f532-1628-48ee-9ecc-dc28f76e65a4', 'foo', 'bar')
      }
      return _from(adIds).pipe(
        mergeMap(adId =>
          _of(adId).pipe(
            mergeMap(adId =>
              ajax({
                url: 'https://adid-validator.doubleverify.workers.dev/',
                method: 'POST',
                headers: {
                  'content-type': 'application/json'
                },
                body: {
                  adId
                }
              })
            ),
            map(({ response: { valid } }) =>
              valid ? adIdValidationSucceeded(adId) : adIdValidationFailed(adId)
            ),
            catchError(err =>
              _of(adIdValidationRequestFailed(adId, err.message))
            )
          )
        ),
        takeUntil(action$.ofType(END_TEST))
      )
    })
  )

export default adIdValidationEpic
