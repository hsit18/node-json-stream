import React from "react";
import "./App.css";
import PostListing from "./pages/PostListing";

const App = (): JSX.Element => {
  return (
    <div className="app" data-testid="app">
      <PostListing />
    </div>
  );
};

export default App;
