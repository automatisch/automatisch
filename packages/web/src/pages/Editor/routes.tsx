import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateFlowPage from './create';
import EditorPage from './index';

export default function EditorRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route path="/create" element={<CreateFlowPage />} />

      <Route path="/:flowId" element={<EditorPage />} />
    </Routes>
  );
}
