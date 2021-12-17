import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateFlowPage from './create';

export default function Editor() {
  return (
    <Routes>
      <Route path="/create" element={<CreateFlowPage />} />
    </Routes>
  )
}
