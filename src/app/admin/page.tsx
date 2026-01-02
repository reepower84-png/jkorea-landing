"use client";

import { useEffect, useState } from "react";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
  status: "pending" | "contacted" | "completed";
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  // 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth");
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated) {
        fetchInquiries();
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword("");
        fetchInquiries();
      } else {
        setAuthError(data.error);
      }
    } catch {
      setAuthError("로그인 처리 중 오류가 발생했습니다.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      setInquiries([]);
    } catch {
      alert("로그아웃에 실패했습니다.");
    }
  };

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/inquiry");
      const data = await response.json();
      if (response.ok) {
        setInquiries(data.inquiries);
      } else {
        setError(data.error);
      }
    } catch {
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/inquiry", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        setInquiries((prev) =>
          prev.map((inq) =>
            inq.id === id ? { ...inq, status: status as Inquiry["status"] } : inq
          )
        );
      }
    } catch {
      alert("상태 업데이트에 실패했습니다.");
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/inquiry?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      }
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            대기중
          </span>
        );
      case "contacted":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            연락완료
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            처리완료
          </span>
        );
      default:
        return null;
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (filter === "all") return true;
    return inq.status === filter;
  });

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter((inq) => inq.status === "pending").length,
    contacted: inquiries.filter((inq) => inq.status === "contacted").length,
    completed: inquiries.filter((inq) => inq.status === "completed").length,
  };

  // 인증 상태 확인 중
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  // 로그인 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              조력자들 관리자
            </h1>
            <p className="text-gray-600">관리자 비밀번호를 입력해주세요</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="비밀번호 입력"
                required
                autoFocus
              />
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-bold transition-colors"
            >
              {authLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            문제가 있으신가요? 관리자에게 문의하세요.
          </p>
        </div>
      </div>
    );
  }

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  // 관리자 대시보드
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                조력자들 관리자
              </h1>
              <p className="text-gray-600 mt-1">문의 관리 대시보드</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchInquiries}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                새로고침
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-gray-600">전체 문의</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <div className="text-gray-600">대기중</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600">
              {stats.contacted}
            </div>
            <div className="text-gray-600">연락완료</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-green-600">
              {stats.completed}
            </div>
            <div className="text-gray-600">처리완료</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              전체 ({stats.total})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
              }`}
            >
              대기중 ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("contacted")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "contacted"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              연락완료 ({stats.contacted})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-green-50 text-green-600 hover:bg-green-100"
              }`}
            >
              처리완료 ({stats.completed})
            </button>
          </div>
        </div>

        {/* Inquiry List */}
        {filteredInquiries.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm text-center">
            <div className="text-gray-400 text-lg">문의가 없습니다.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusBadge(inquiry.status)}
                      <span className="text-sm text-gray-500">
                        {formatDate(inquiry.createdAt)}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">이름</div>
                        <div className="font-medium text-gray-900">
                          {inquiry.name}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">연락처</div>
                        <div className="font-medium text-gray-900">
                          <a
                            href={`tel:${inquiry.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {inquiry.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">문의 내용</div>
                      <div className="text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                        {inquiry.message}
                      </div>
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2">
                    <select
                      value={inquiry.status}
                      onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="pending">대기중</option>
                      <option value="contacted">연락완료</option>
                      <option value="completed">처리완료</option>
                    </select>
                    <button
                      onClick={() => deleteInquiry(inquiry.id)}
                      className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
