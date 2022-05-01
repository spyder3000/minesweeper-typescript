import React from "react";
import NumberDisplay from "../NumberDisplay";
import "./App.scss";

// React.FC -- TS of React Functional Component
const App: React.FC = () => {
	return (
		<div className="App">
			<div className="Header">
				<NumberDisplay value={0} />
				<div className="Face">
					<span role="img" aria-label="face">
						🙂
					</span>
				</div>
				<NumberDisplay value={23} />
			</div>
			<div className="Body">Body</div>
		</div>
	);
};
function index() {
	return <div>index</div>;
}

export default App;
