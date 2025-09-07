import CommonLayout from "./components/layouts/CommonLayout";
import { Outlet } from "react-router";

function App() {
  return (
    <div>
      <CommonLayout>
        <Outlet />
      </CommonLayout>
    </div>
  );
}

export default App;
