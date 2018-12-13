import { addProjectMember as addMember,
  removeProjectMember as removeMember,
  updateProjectMember as updateMember,
  loadMemberSuggestions as loadMemberSuggestionsAPI
} from '../../api/projectMembers'
import { loadMembers } from '../../actions/members'

import {ADD_PROJECT_MEMBER, REMOVE_PROJECT_MEMBER, UPDATE_PROJECT_MEMBER,
  LOAD_MEMBER_SUGGESTIONS,
  REMOVE_CUSTOMER_INVITE,
  INVITE_TOPCODER_MEMBER,
  REMOVE_TOPCODER_MEMBER_INVITE,
  INVITE_CUSTOMER
} from '../../config/constants'


export function loadMemberSuggestions(value) {
  return (dispatch) => {
    return dispatch({
      type: LOAD_MEMBER_SUGGESTIONS,
      payload: loadMemberSuggestionsAPI(value)
    })
  }
}

function addProjectMemberWithData(dispatch, projectId, member) {
  return new Promise((resolve, reject) => {
    return dispatch({
      type: ADD_PROJECT_MEMBER,
      payload: addMember(projectId, member)
    })
      .then((/*{value, action}*/) => {
        return resolve(dispatch(loadMembers([member.userId])))
      })
      .catch(err => reject(err))
  })
}

export function addProjectMember(projectId, member) {
  return (dispatch) => {
    return dispatch({
      type: 'ADD_PROJECT_MEMBER_INIT',
      payload: addProjectMemberWithData(dispatch, projectId, member)
    })
  }
}

export function updateProjectMember(projectId, memberId, member) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_PROJECT_MEMBER,
      payload: updateMember(projectId, memberId, member)
    })
  }
}

export function removeProjectMember(projectId, memberId, isUserLeaving) {
  return (dispatch) => {
    return dispatch({
      type: REMOVE_PROJECT_MEMBER,
      payload: removeMember(projectId, memberId),
      meta: { isUserLeaving }
    })
  }
}

export function inviteTopcoderMembers(projectId, items) {
  const mock = new Promise((resolve) => {
    setTimeout(() => {
      resolve(items)
    }, 2000)
  })
  return (dispatch) => {
    dispatch({
      type: INVITE_TOPCODER_MEMBER,
      payload: mock
    })
  }
}

export function deleteTopcoderMemberInvite(projectId, item) {
  const mock = new Promise((resolve) => {
    setTimeout(() => {
      resolve(item)
    }, 2000)
  })
  return (dispatch) => {
    dispatch({
      type: REMOVE_TOPCODER_MEMBER_INVITE,
      payload: mock
    })
  }
}

export function inviteProjectMembers(projectId, emailIds) {
  const mock = new Promise((resolve) => {
    setTimeout(() => {
      resolve(emailIds)
    }, 2000)
  })
  return (dispatch) => {
    dispatch({
      type: INVITE_CUSTOMER,
      payload: mock
    })
  }
}

export function deleteProjectInvite(projectId, emailId) {
  const mock = new Promise((resolve) => {
    setTimeout(() => {
      resolve(emailId)
    }, 2000)
  })
  return (dispatch) => {
    dispatch({
      type: REMOVE_CUSTOMER_INVITE,
      payload: mock
    })
  }
}
