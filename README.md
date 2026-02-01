# Shoemoa Frontend

신발 쇼핑몰 사이드 프로젝트 **Shoemoa**의 프론트엔드 레포지토리입니다.  
Next.js와 Vercel v0를 기반으로 UI를 구성했으며, Tailwind CSS와 shadcn/ui를 사용해 스타일링했습니다.

---

## 📖 Project Overview

이 프로젝트는 사용자 및 관리자를 위한 전체 UI를 포함합니다.

### 사용자 기능
- 회원가입 / 로그인
- 상품 목록 (검색, 정렬 기능 포함)
- 상품 상세 정보 조회
- 장바구니
- 주문 페이지

### 관리자 기능
- 상품 대시보드
- 상품 등록, 수정, 삭제
- 반응형 UI 지원

---

## 🛠 Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Deployment**: Vercel
- **API**: Spring Boot REST API (연동 예정)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm

### Installation
```bash
pnpm install
```

### Run Development Server
```bash
pnpm run dev
```
애플리케이션은 `http://localhost:3000` 에서 실행됩니다.

---

## 🗺️ Development Roadmap

- **[v]** UI/UX 프로토타입 구현 (v0)
- **[ ]** 백엔드 API 연동
    - `[ ]` 상품 목록/상세 조회 연동
    - `[ ]` 회원 인증 (로그인/회원가입) 연동
    - `[ ]` 장바구니 및 주문 기능 연동
- **[ ]** 상태 관리 라이브러리 도입 (예: Zustand 또는 Recoil)
- **[ ]** 테스트 코드 작성 (Jest, React Testing Library)

---

## 🔌 API 연동

백엔드 API 연동은 `lib/api` 디렉토리에서 관리합니다. API 기본 주소는 환경변수로 설정합니다.

```bash
# .env.local 파일 예시
VITE_API_BASE_URL=http://localhost:8080
```

**⚠️ 중요**  
> 현재 백엔드 서버의 배포가 안정화되지 않았습니다.  
> **따라서 실제 API 호출은 실패할 수 있으며, `lib/mock-data.ts`에 정의된 목(Mock) 데이터를 우선적으로 사용하고 있습니다.**  
> 백엔드 개발이 완료되면 실제 API로 전환될 예정입니다.

---

## 📦 Deployment

- **Hosting**: Vercel
- **Project Dashboard**: [Vercel Dashboard](https://vercel.com/aqwsde321s-projects/shoemoa-frontend/GmUBnNvEeisMx8G3yjtBxuJBiFL9)
- `main` 브랜치에 push 시 자동 배포가 트리거됩니다.
- **Live Demo**: [https://shoemoa-frontend.vercel.app/](https://shoemoa-frontend.vercel.app/)
