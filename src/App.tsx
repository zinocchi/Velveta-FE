// import Login from "./pages/login";
import { testLogin } from "./pages/testLogin";
// function App() {
//   return (
//     <div>
//       <Login />
//     </div>
//   );
// }

function App() {
  return (
    <div>
      <button onClick={testLogin}>
        Test Login API
      </button>
    </div>
  );
}

export default App;
