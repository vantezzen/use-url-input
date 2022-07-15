import React, { useState } from "react";

import useUrlInput from "use-url-input";

const App = () => {
  const [url, setUrl] = useState("");
  useUrlInput(url, setUrl);

  return (
    <div>
      <h1>useUrlInput Demo</h1>

      <label>URL</label>
      <br />
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
      />
      <p>
        The hook tries to ensure that the input is a URL with HTTP or HTTPS as
        its protocol as you type.
      </p>
    </div>
  );
};
export default App;
