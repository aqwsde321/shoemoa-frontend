# Project: Shoemoa Frontend

This document provides a summary of the Shoemoa Frontend project, intended for use by the Gemini CLI.

## Project Overview

Shoemoa Frontend is the user interface for the Shoemoa shoe shopping mall. It is a [Next.js](https://nextjs.org/) application written in [TypeScript](https://www.typescriptlang.org/) and styled with [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/). The project was initially generated using [Vercel v0](https://v0.dev/).

The application includes user-facing features like sign-up/login, product lists with search and sort, product details, a shopping cart, and an order page. It also has an admin section for managing products. The frontend is designed to be responsive and will eventually connect to a Spring Boot REST API for backend services.

## Building and Running

### Development

To run the application in development mode:

```bash
npm run dev
```

This will start a development server, typically on [http://localhost:3000](http://localhost:3000).

### Production Build

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `.next` directory. Note that `typescript.ignoreBuildErrors` is set to `true` in `next.config.mjs`, so TypeScript errors will not block the build.

To start a production server:

```bash
npm run start
```

### Linting

To check the code for linting errors:

```bash
npm run lint
```

## Development Conventions

*   **UI Components**: The project uses `shadcn/ui` for many of its UI components. These are located in `components/ui`.
*   **API Integration**: API-related code can be found in `lib/api`. The base URL for the API is configured via the `VITE_API_BASE_URL` environment variable.
*   **Mock Data**: Mock data for development is located in `lib/mock-data.ts`.
*   **Deployment**: The project is configured for continuous deployment on [Vercel](https://vercel.com/). Pushing to the `main` branch will trigger a new deployment.

## Agent Instructions

- 에이전트는 항상 한국어로 응답해야 합니다.
- 모든 아티팩트 문서(`implementation_plan.md`, `walkthrough.md`, `task.md` 등)는 항상 한국어로 작성해야 합니다.
- Git 커밋 메시지는 항상 한국어로 작성해야 합니다.

---

## Production Authentication Strategy: In-Memory Access Token + HTTP-only Refresh Token

이 문서는 프로덕션 환경에서 JWT 인증을 구현하기 위한 백엔드와 프론트엔드의 책임 분담에 대해 설명합니다. 이 전략은 단기 액세스 토큰과 장기 HTTP-only 리프레시 토큰을 사용하여 보안과 사용자 경험의 균형을 맞춥니다.

### 백엔드 개발 시 고려 사항

백엔드는 인증 흐름에서 다음 역할을 담당합니다:

1.  **로그인 엔드포인트 (`POST /api/members/login`):**
    *   사용자 자격 증명(이메일, 비밀번호)을 검증합니다.
    *   인증에 성공하면:
        *   **만료 기간이 짧은 액세스 토큰**을 생성합니다. (예: 15분 ~ 30분)
        *   **만료 기간이 긴 리프레시 토큰**을 생성합니다. (예: 며칠 ~ 몇 주)
        *   **액세스 토큰**은 응답 본문(JSON)에 담아 프론트엔드로 전송합니다.
        *   **리프레시 토큰**은 `HttpOnly`, `Secure`, `SameSite=Strict` 또는 `Lax` 옵션이 설정된 **쿠키**로 프론트엔드에 설정합니다.
            *   `HttpOnly`: JavaScript에서 쿠키에 접근할 수 없게 하여 XSS 공격으로부터 보호합니다.
            *   `Secure`: HTTPS 연결에서만 쿠키가 전송되도록 강제하여 중간자 공격으로부터 보호합니다.
            *   `SameSite`: CSRF 공격 방지에 도움을 줍니다. (`Strict`가 가장 강력하지만, `Lax`도 일반적인 경우에 적합합니다.)
    *   (선택 사항) 리프레시 토큰을 데이터베이스에 저장하고, 사용자가 로그아웃하거나 토큰이 유효하지 않을 때 해당 토큰을 무효화하는 메커니즘을 구현합니다.

2.  **리프레시 토큰 엔드포인트 (예: `POST /api/auth/refresh`):**
    *   프론트엔드로부터 토큰 재발급 요청을 받습니다. 이 요청에는 브라우저가 자동으로 포함하는 HTTP-only 리프레시 토큰 쿠키가 포함되어야 합니다.
    *   수신된 리프레시 토큰의 유효성을 검증합니다.
    *   리프레시 토큰이 유효하면:
        *   **새로운 액세스 토큰**을 발급하여 응답 본문에 담아 프론트엔드로 전송합니다.
        *   (선택 사항) 보안 강화를 위해 새로운 리프레시 토큰을 발급하여 새 쿠키로 설정하고, 이전 리프레시 토큰을 무효화할 수 있습니다. (Refresh Token Rotation)
    *   리프레시 토큰이 유효하지 않으면 401 Unauthorized 응답을 반환하여 프론트엔드가 사용자에게 재로그인을 요청하도록 합니다.

3.  **보호된 엔드포인트 (예: `/api/products/**` (CUD), `/api/cart/**`, `/api/orders/**`):**
    *   `Authorization` 헤더(`Bearer <AccessToken>`)에 포함된 액세스 토큰을 기대합니다.
    *   액세스 토큰의 유효성을 검증합니다.
    *   토큰이 유효하고 권한이 있으면 요청을 처리하고, 그렇지 않으면 401 Unauthorized 또는 403 Forbidden 응답을 반환합니다.

### 프론트엔드 개발 시 고려 사항

프론트엔드는 인증 흐름에서 다음 역할을 담당합니다:

1.  **로그인 처리 및 인증 상태 관리:**
    *   로그인 성공 후 백엔드로부터 응답 본문에 포함된 **액세스 토큰, 이메일, 사용자 역할(role)**을 수신합니다.
    *   **보안과 편의의 균형을 위해**: 사용자의 이메일과 역할은 `localStorage`에 저장하여 새로고침 후에도 유지하며, **액세스 토큰은 메모리(in-memory)에만 저장**하여 XSS 공격 노출 위험을 최소화합니다.
    *   **Silent Refresh**: `AuthProvider`(`lib/hooks/use-auth.tsx`)의 초기화 로직에서 `localStorage`의 메타데이터를 확인하고, 백엔드의 `reissue` 엔드포인트를 호출하여 자동으로 액세스 토큰을 복구합니다.

2.  **역할 기반 접근 제어 (RBAC) 구현:**
    *   **로그인 성공 시, 사용자 역할(예: 'ADMIN', 'USER')에 따라 \`/admin\` 페이지 또는 홈 페이지(\`/\`)로 자동 리디렉션됩니다.**
    *   **관리자 페이지(\`/admin\` 경로)는 \`app/admin/layout.tsx\`에 구현된 인증 가드를 통해 보호되며, ADMIN 역할의 사용자만 접근할 수 있습니다.** 비인가 사용자는 로그인 페이지로 리디렉션됩니다.
    *   애플리케이션 헤더(\`components/layout/header.tsx\`) 등에서 사용자 역할에 따라 '관리자 대시보드' 링크를 조건부로 표시합니다.

3.  **API 요청 시:**
    *   보호된 API 엔드포인트로 요청을 보낼 때마다 \`lib/auth-storage.ts\`에서 가져온 액세스 토큰을 \`Authorization\` 헤더에 \`Bearer <AccessToken>\` 형식으로 포함하여 전송합니다.
    *   (권장) \`fetchApi\` 함수와 함께 \`axios\` 인터셉터와 같은 기능을 사용하여 모든 API 요청에 자동으로 토큰을 삽입하는 로직이 구현되어 있습니다.

4.  **액세스 토큰 만료 처리:**
    *   API 요청이 401 Unauthorized 응답을 받으면, 액세스 토큰이 만료되었을 가능성이 높습니다.
    *   이 경우, 백엔드의 **리프레시 토큰 엔드포인트**(`POST /api/members/reissue`)로 새로운 액세스 토큰을 요청합니다.
    *   리프레시 토큰 요청이 성공하면, 새로 발급받은 액세스 토큰으로 메모리 저장소를 업데이트하고, 이전에 실패했던 원래 API 요청을 자동으로 재시도합니다. (인터셉터 로직 구현 완료)
    *   리프레시 토큰 요청도 실패하면 (예: 리프레시 토큰도 만료되거나 유효하지 않음), 사용자에게 재로그인이 필요함을 알리고 로그인 페이지로 리디렉션합니다.

5.  **로그아웃:**
    *   \`useAuth\` 훅의 \`logout\` 함수를 통해 \`localStorage\`에 저장된 액세스 토큰과 사용자 역할을 삭제합니다.
    *   로그아웃 후에는 로그인 페이지로 리디렉션합니다.
    *   (선택 사항) 백엔드의 로그아웃 엔드포인트를 호출하여 서버 측에서 리프레시 토큰을 무효화하도록 요청하는 로직은 현재 구현되어 있지 않습니다.

### 보안 고려 사항

*   **액세스 토큰:** 짧은 만료 시간과 메모리 저장을 통해 XSS 공격 노출 위험을 최소화합니다.
*   **리프레시 토큰:** HTTP-only 쿠키 사용으로 XSS 공격으로부터 안전하며, \`Secure\` 및 \`SameSite\` 옵션으로 추가적인 보호를 제공합니다.
*   **HTTPS 사용:** 모든 통신은 반드시 HTTPS를 통해 이루어져야 합니다.
*   **토큰 유효성 검증:** 백엔드는 모든 수신 토큰의 유효성(서명, 만료 시간 등)을 엄격하게 검증해야 합니다.
*   **리프레시 토큰 무효화:** 비정상적인 활동이 감지되거나 사용자 로그아웃 시 리프레시 토큰을 무효화할 수 있는 백엔드 메커니즘을 갖추는 것이 중요합니다.