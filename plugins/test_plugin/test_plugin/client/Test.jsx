// This file is part of Indico.UN.
// Copyright (C) 2019 - 2023 United Nations. All rights reserved.

import React from 'react';

// import 'indico/modules/search/client/js/components/ResultList.module.scss';

export default function Test({}) {
  return (
    <div className="form-group">

      <label className="label" htmlFor="id_vojta_test_input">
        <span className="label-text ">VOJTA TEST INPUT</span>
      </label>
      <input type="text" name="vojta_test_input" maxLength="255" className="form-control" placeholder="VOJTA TEST INPUT"
             id="id_vojta_test_input"></input>
      </div>
  );
}

Test.propTypes = {};
