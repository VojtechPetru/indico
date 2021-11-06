// This file is part of Indico.
// Copyright (C) 2002 - 2021 CERN
//
// Indico is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see the
// LICENSE file for more details.

import modifyFieldURL from 'indico-url:event_registration.modify_field';
import modifyTextURL from 'indico-url:event_registration.modify_text';
import moveFieldURL from 'indico-url:event_registration.move_field';
import moveSectionURL from 'indico-url:event_registration.move_section';
import moveTextURL from 'indico-url:event_registration.move_text';
import toggleFieldURL from 'indico-url:event_registration.toggle_field';
import toggleTextURL from 'indico-url:event_registration.toggle_text';

import {indicoAxios} from 'indico/utils/axios';
import {ajaxAction} from 'indico/utils/redux';

import {getSectionIdByItemId, getURLParams, pickItemURL} from './selectors';

export const LOCK_UI = 'Lock interface';
export const UNLOCK_UI = 'Unlock interface';
export const MOVE_SECTION = 'Move section';
export const MOVE_ITEM = 'Move item';
export const UPDATE_ITEM = 'Update item';
export const REMOVE_ITEM = 'Remove item';

function lockUI() {
  return {type: LOCK_UI};
}

function unlockUI() {
  return {type: UNLOCK_UI};
}

function lockingAjaxAction(requestFunc, ...args) {
  const fn = ajaxAction(requestFunc, ...args);
  return async dispatch => {
    dispatch(lockUI());
    const resp = await fn();
    dispatch(unlockUI());
    return resp;
  };
}

export function moveSection(sourceIndex, targetIndex) {
  return {type: MOVE_SECTION, sourceIndex, targetIndex};
}

export function moveItem(sectionId, sourceIndex, targetIndex) {
  return {type: MOVE_ITEM, sectionId, sourceIndex, targetIndex};
}

export function updateItem(sectionId, itemId, data) {
  return {type: UPDATE_ITEM, sectionId, itemId, data};
}

export function _removeItem(sectionId, itemId) {
  return {type: REMOVE_ITEM, sectionId, itemId};
}

export function saveSectionPosition(sectionId, position, oldPosition) {
  return async (dispatch, getStore) => {
    const store = getStore();
    const url = moveSectionURL(getURLParams(store)(sectionId));
    const resp = await lockingAjaxAction(() => indicoAxios.post(url, {endPos: position}))(dispatch);
    if (resp.error) {
      // XXX alternatively we could keep the UI locked and require a refresh after
      // a failure to make sure we are in a fully consistent state...
      // but moving stuff around is the only case where the local state gets updated
      // before saving, so it's probably not worth it
      dispatch(moveSection(position, oldPosition));
    }
  };
}

export function saveItemPosition(sectionId, itemId, position, oldPosition) {
  return async (dispatch, getStore) => {
    const store = getStore();
    const urlFunc = pickItemURL(store, itemId)(moveTextURL, moveFieldURL);
    const url = urlFunc(getURLParams(store)(sectionId, itemId));
    const resp = await lockingAjaxAction(() => indicoAxios.post(url, {endPos: position}))(dispatch);
    if (resp.error) {
      // XXX alternatively we could keep the UI locked and require a refresh after
      // a failure to make sure we are in a fully consistent state...
      // but moving stuff around is the only case where the local state gets updated
      // before saving, so it's probably not worth it
      dispatch(moveItem(sectionId, position, oldPosition));
    }
  };
}

export function enableItem(itemId) {
  return async (dispatch, getStore) => {
    const store = getStore();
    const sectionId = getSectionIdByItemId(store, itemId);
    const urlFunc = pickItemURL(store, itemId)(toggleTextURL, toggleFieldURL);
    const params = getURLParams(store)(sectionId, itemId);
    const url = urlFunc({...params, enable: 'true'});
    const resp = await lockingAjaxAction(() => indicoAxios.post(url))(dispatch);
    if (!resp.error) {
      // XXX this API should probably be changed to return the whole section or at least
      // the updated positions for all items - right now it only returns the changed item
      // even though the positions of other items change as well
      dispatch(updateItem(sectionId, itemId, resp.data.view_data));
    }
  };
}

export function disableItem(itemId) {
  return async (dispatch, getStore) => {
    const store = getStore();
    const sectionId = getSectionIdByItemId(store, itemId);
    const urlFunc = pickItemURL(store, itemId)(toggleTextURL, toggleFieldURL);
    const params = getURLParams(store)(sectionId, itemId);
    const url = urlFunc({...params, enable: 'false'});
    const resp = await lockingAjaxAction(() => indicoAxios.post(url))(dispatch);
    if (!resp.error) {
      // XXX this API should probably be changed to return the whole section or at least
      // the updated positions for all items - right now it only returns the changed item
      // even though the positions of other items change as well
      dispatch(updateItem(sectionId, itemId, resp.data.view_data));
    }
  };
}

export function removeItem(itemId) {
  return async (dispatch, getStore) => {
    const store = getStore();
    const sectionId = getSectionIdByItemId(store, itemId);
    const urlFunc = pickItemURL(store, itemId)(modifyTextURL, modifyFieldURL);
    const url = urlFunc(getURLParams(store)(sectionId, itemId));
    const resp = await lockingAjaxAction(() => indicoAxios.delete(url))(dispatch);
    if (!resp.error) {
      dispatch(_removeItem(sectionId, itemId));
    }
  };
}