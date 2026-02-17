import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/F3.png"; // Make sure the path is correct

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const stored = localStorage.getItem("userCredentials");

    if (!stored) {
      alert("No registered user found. Please register first.");
      return;
    }

    const savedUser = JSON.parse(stored);
    if (email === savedUser.email && password === savedUser.password) {
      // Save current user session with complete data
      const currentUserData = {
        name: savedUser.fullName || savedUser.name || 'User',
        email: savedUser.email,
        phone: savedUser.phone || '+1 234 567 8900',
        location: savedUser.location || 'New York, USA',
        joinDate: savedUser.joinDate || new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
      };
      
      localStorage.setItem("currentUser", JSON.stringify(currentUserData));
      localStorage.setItem("user", JSON.stringify({ email }));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('userUpdated', { 
        detail: currentUserData 
      }));
      
      navigate("/home");
    } else {
      alert("Invalid email or password. Try again.");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!agreeToTerms) {
      alert("Please agree to Terms of Service and Privacy Policy.");
      return;
    }

    const userData = {
      fullName,
      email,
      password,
      phone: '+1 234 567 8900',
      location: 'New York, USA',
      joinDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
    };

    localStorage.setItem("userCredentials", JSON.stringify(userData));
    alert("Registration successful! Please log in.");
    setIsLogin(true);
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white/5 backdrop-blur p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-white/80 mb-8 text-center">
          {isLogin
            ? "Enter your details to access your account"
            : "Enter your details to create your account"}
        </p>

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-white/80 text-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 rounded border-white/20 bg-white/10 text-purple-600"
                />
                Remember me
              </label>
              <a href="#" className="text-white/80 text-sm hover:text-white">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              Sign In
            </button>

            <p className="text-center mt-4 text-white/80">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-white hover:underline"
              >
                Create Account
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />

            <label className="flex items-start text-white/80 text-sm">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mr-2 mt-1 rounded border-white/20 bg-white/10 text-purple-600"
                required
              />
              <span>
                I agree to the <a href="#" className="hover:underline">Terms</a> and{" "}
                <a href="#" className="hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              Create Account
            </button>

            <p className="text-center mt-4 text-white/80">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-white hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
