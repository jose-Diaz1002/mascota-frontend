import "./AuthLayout.css"

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-form-section">{children}</div>
      <div className="auth-showcase-section"></div>
    </div>
  )
}

export default AuthLayout
