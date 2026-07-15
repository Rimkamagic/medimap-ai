"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type AuthMode = "login" | "signup";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isLogin = mode === "login";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("비밀번호는 6자 이상 입력해 주세요.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError(".env.local에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해 주세요.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          throw signInError;
        }

        router.push("/");
        router.refresh();
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name || email.split("@")[0]
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.session) {
        router.push("/");
        router.refresh();
      } else {
        setMessage("회원가입 요청이 완료되었습니다. Supabase 설정에 따라 이메일 확인 후 로그인할 수 있습니다.");
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "인증 처리 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell py-14">
      <section className="mx-auto max-w-xl">
        <div className="card p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-teal-100 text-teal-800">
              {isLogin ? <LogIn className="size-8" aria-hidden="true" /> : <UserPlus className="size-8" aria-hidden="true" />}
            </div>
            <h1 className="text-3xl font-extrabold">{isLogin ? "로그인" : "회원가입"}</h1>
            <p className="mt-3 text-slate-700">{isLogin ? "MediMap AI 계정으로 검색 기록을 안전하게 관리하세요." : "이메일과 비밀번호로 새 계정을 만듭니다."}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <label>
                <span className="mb-2 block font-bold">이름</span>
                <input value={name} onChange={(event) => setName(event.target.value)} className="field" placeholder="홍길동" autoComplete="name" />
              </label>
            )}
            <label>
              <span className="mb-2 block font-bold">이메일</span>
              <input value={email} onChange={(event) => setEmail(event.target.value)} className="field" type="email" placeholder="you@example.com" autoComplete="email" required />
            </label>
            <label>
              <span className="mb-2 block font-bold">비밀번호</span>
              <input value={password} onChange={(event) => setPassword(event.target.value)} className="field" type="password" placeholder="6자 이상" autoComplete={isLogin ? "current-password" : "new-password"} required />
            </label>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700" role="alert">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm font-semibold text-teal-800" role="status">
                {message}
              </div>
            )}

            <button type="submit" className="btn-primary w-full px-6 py-4 text-lg" disabled={loading}>
              {loading ? "처리 중..." : isLogin ? "로그인" : "회원가입"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-700">
            {isLogin ? "아직 계정이 없나요?" : "이미 계정이 있나요?"}{" "}
            <Link href={isLogin ? "/signup" : "/login"} className="font-extrabold text-teal-800">
              {isLogin ? "회원가입" : "로그인"}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
