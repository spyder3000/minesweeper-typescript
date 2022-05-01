import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./components/App"; // will pull index.tsx by default, so don't have to specify that

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
