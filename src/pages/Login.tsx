import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { usePlatform } from "../contexts/PlatformContext";
import { UserRole, Department } from "../types";
import styles from "../styles/pages.module.css";
import Logo from "../assets/logo.png";
import { Eye, EyeOff, ShieldCheck, Users, Briefcase } from "lucide-react";

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");

  const { login } = useAuth();
  const { addAuditLog } = usePlatform();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setUsername("");
    setPassword("");
    setUsernameError("");
    setPasswordError("");
    setRoleError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let uErr = "";
    let pErr = "";
    let rErr = "";

    const credentials = {
  Admin: {
    username: "admin",
    password: "admin123",
  },
  HR: {
    username: "hr",
    password: "hr123",
  },
  Manager: {
    username: "manager",
    password: "manager123",
  },
};

if (!selectedRole) {
  rErr = "Please select a role.";
} else {
  const userCredential = credentials[selectedRole];

  if (!username.trim()) {
    uErr = "Please enter Username.";
  } else if (username !== userCredential.username) {
    uErr = `Invalid Username! Use "${userCredential.username}".`;
  }

  if (!password.trim()) {
    pErr = "Please enter Password.";
  } else if (password !== userCredential.password) {
    pErr = `Invalid Password! Use "${userCredential.password}".`;
  }
}

    setRoleError(rErr);
    setUsernameError(uErr);
    setPasswordError(pErr);

    if (rErr || uErr || pErr) {
      return;
    }

    let defaultName = "Eleanor Vance";
    let dept: Department | undefined = undefined;

    if (selectedRole === "HR") {
      defaultName = "Marcus Brody";
    } else if (selectedRole === "Manager") {
      defaultName = "David Kim";
      dept = "Engineering";
    }

    const defaultRoute = login(selectedRole!, defaultName, undefined, dept);
    addAuditLog("User Authentication Login", `Interactive Session (${selectedRole})`, "Success", defaultName, selectedRole!);
    const target = (location.state?.from && location.state.from.pathname !== '/') ? location.state.from.pathname : defaultRoute;
    navigate(target, { replace: true });
  };

  return (
    <div className={styles.loginPage}>
      {/* Decorative Shapes */}
      <div className={styles.shapeOne}></div>
      <div className={styles.shapeTwo}></div>
      <div className={styles.shapeThree}></div>
      <div className={styles.circleOne}></div>
      <div className={styles.circleTwo}></div>

      {/* LEFT SIDE */}
      <div className={styles.leftSection}>
        <img src={Logo} alt="Stackly" className={styles.logo} />

        <h2 className={styles.welcomeTitle}>Welcome!</h2>

        <div className={styles.line}></div>

        <p className={styles.description}>
          Workforce Analytics Platform provides real-time insights into employee performance, hiring, productivity, departments, workforce distribution and business intelligence through a modern interactive dashboard.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.rightSection}>
        <div className={styles.loginCard}>
          <h2 className={styles.cardTitle}>Sign In</h2>

          {/* Role Selection Box */}
          <div style={{ marginBottom: '18px', background: 'rgba(99, 102, 241, 0.12)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <h3 style={{ color: '#ffffff', fontSize: '0.86rem', fontWeight: 700, marginBottom: '12px' }}>
              Select Role
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleRoleSelect("Admin")}
                style={{
                  background: selectedRole === "Admin" ? 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)' : 'rgba(30, 41, 59, 0.5)',
                  color: 'white',
                  border: selectedRole === "Admin" ? '2px solid #ffffff' : '2px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '10px 4px',
                  fontSize: '0.78rem',
                  fontWeight: selectedRole === "Admin" ? 800 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: selectedRole === "Admin" ? 'translateY(-3px) scale(1.02)' : 'scale(0.98)',
                  boxShadow: selectedRole === "Admin" 
                    ? '0 10px 25px rgba(99, 102, 241, 0.65), 0 0 10px rgba(255,255,255,0.35) inset' 
                    : '0 2px 6px rgba(0,0,0,0.25)',
                  opacity: selectedRole === "Admin" ? 1 : 0.75,
                  position: 'relative'
                }}
              >
                <div style={{
                  transform: selectedRole === "Admin" ? 'scale(1.22) translateY(-1px)' : 'scale(1)',
                  transition: 'all 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: selectedRole === "Admin" ? 'drop-shadow(0 0 8px rgba(252, 165, 165, 0.85))' : 'none',
                  display: 'flex'
                }}>
                  <ShieldCheck size={20} color="#fca5a5" />
                </div>
                <span style={{ letterSpacing: selectedRole === "Admin" ? '0.03em' : 'normal', transition: 'all 0.3s ease' }}>
                  Admin Role
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("HR")}
                style={{
                  background: selectedRole === "HR" ? 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)' : 'rgba(30, 41, 59, 0.5)',
                  color: 'white',
                  border: selectedRole === "HR" ? '2px solid #ffffff' : '2px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '10px 4px',
                  fontSize: '0.78rem',
                  fontWeight: selectedRole === "HR" ? 800 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: selectedRole === "HR" ? 'translateY(-3px) scale(1.02)' : 'scale(0.98)',
                  boxShadow: selectedRole === "HR" 
                    ? '0 10px 25px rgba(79, 70, 229, 0.65), 0 0 10px rgba(255,255,255,0.35) inset' 
                    : '0 2px 6px rgba(0,0,0,0.25)',
                  opacity: selectedRole === "HR" ? 1 : 0.75,
                  position: 'relative'
                }}
              >
                <div style={{
                  transform: selectedRole === "HR" ? 'scale(1.22) translateY(-1px)' : 'scale(1)',
                  transition: 'all 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: selectedRole === "HR" ? 'drop-shadow(0 0 8px rgba(110, 231, 183, 0.85))' : 'none',
                  display: 'flex'
                }}>
                  <Users size={20} color="#6ee7b7" />
                </div>
                <span style={{ letterSpacing: selectedRole === "HR" ? '0.03em' : 'normal', transition: 'all 0.3s ease' }}>
                  HR Specialist
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("Manager")}
                style={{
                  background: selectedRole === "Manager" ? 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' : 'rgba(30, 41, 59, 0.5)',
                  color: 'white',
                  border: selectedRole === "Manager" ? '2px solid #ffffff' : '2px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '10px 4px',
                  fontSize: '0.78rem',
                  fontWeight: selectedRole === "Manager" ? 800 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: selectedRole === "Manager" ? 'translateY(-3px) scale(1.02)' : 'scale(0.98)',
                  boxShadow: selectedRole === "Manager" 
                    ? '0 10px 25px rgba(59, 130, 246, 0.65), 0 0 10px rgba(255,255,255,0.35) inset' 
                    : '0 2px 6px rgba(0,0,0,0.25)',
                  opacity: selectedRole === "Manager" ? 1 : 0.75,
                  position: 'relative'
                }}
              >
                <div style={{
                  transform: selectedRole === "Manager" ? 'scale(1.22) translateY(-1px)' : 'scale(1)',
                  transition: 'all 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  filter: selectedRole === "Manager" ? 'drop-shadow(0 0 8px rgba(147, 197, 253, 0.85))' : 'none',
                  display: 'flex'
                }}>
                  <Briefcase size={20} color="#93c5fd" />
                </div>
                <span style={{ letterSpacing: selectedRole === "Manager" ? '0.03em' : 'normal', transition: 'all 0.3s ease' }}>
                  Manager Role
                </span>
              </button>
            </div>
            {roleError && (
              <div style={{ color: '#f87171', fontSize: '0.82rem', fontWeight: 600, marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {roleError}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Username</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (usernameError) setUsernameError("");
                  }}
                  className={styles.formInput}
                  style={usernameError ? { border: '2px solid #ef4444', backgroundColor: '#ffffff', color: '#0f172a' } : {}}
                />
              </div>
              {usernameError && (
                <div style={{ color: '#f87171', fontSize: '0.82rem', fontWeight: 600, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {usernameError}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  className={styles.formInput}
                  style={passwordError ? { border: '2px solid #ef4444', backgroundColor: '#ffffff', color: '#0f172a' } : {}}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password view"
                  style={passwordError ? { color: '#0f172a' } : {}}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && (
                <div style={{ color: '#f87171', fontSize: '0.82rem', fontWeight: 600, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {passwordError}
                </div>
              )}
            </div>

            <button type="submit" className={styles.loginButton}>
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
