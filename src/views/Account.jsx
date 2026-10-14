import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register, errorMessage } from "../api/shop";
import { useAuth } from "../state/AuthContext";

function Field({ id, label, ...rest }) {
  return (
    <label htmlFor={id} className="field">
      {label}
      <input id={id} {...rest} />
    </label>
  );
}

function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ user: "", password: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      const token = await login(form.user.trim(), form.password);
      signIn(token);
      navigate("/");
    } catch (err) {
      setMsg(err?.response?.status === 401 ? "Invalid username/email or password." : errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h1 className="display display--form">Sign in</h1>
      <Field id="li-user" label="Username or email" autoComplete="username" required value={form.user} onChange={set("user")} />
      <Field id="li-pass" label="Password" type="password" autoComplete="current-password" required value={form.password} onChange={set("password")} />
      <button type="submit" className="btn btn--solid" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      {msg && <p className="note note--error" role="alert">{msg}</p>}
    </form>
  );
}

function Register() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [msg, setMsg] = useState({ text: "", ok: false });
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ text: "", ok: false });
    setBusy(true);
    try {
      await register({ ...form, username: form.username.trim(), email: form.email.trim() });
      setMsg({ text: "Account created. You can sign in now.", ok: true });
      setForm({ name: "", username: "", email: "", password: "" });
    } catch (err) {
      setMsg({ text: errorMessage(err), ok: false });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2 className="display display--form">Create account</h2>
      <Field id="rg-name" label="Name" autoComplete="name" required value={form.name} onChange={set("name")} />
      <Field id="rg-user" label="Username" autoComplete="username" required value={form.username} onChange={set("username")} />
      <Field id="rg-email" label="Email" type="email" autoComplete="email" required value={form.email} onChange={set("email")} />
      <Field id="rg-pass" label="Password (min 6 characters)" type="password" autoComplete="new-password" required minLength={6} value={form.password} onChange={set("password")} />
      <button type="submit" className="btn btn--outline" disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
      {msg.text && <p className={`note ${msg.ok ? "" : "note--error"}`} role={msg.ok ? "status" : "alert"}>{msg.text}</p>}
    </form>
  );
}

export default function Account() {
  return (
    <div className="container section account">
      <SignIn />
      <div className="account__rule" />
      <Register />
    </div>
  );
}
