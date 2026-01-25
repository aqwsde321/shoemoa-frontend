# Shoemoa Frontend (UI Pages)

신발 쇼핑몰 사이드 프로젝트 **Shoemoa**의 프론트엔드 UI 레포지토리입니다.  
Vercel v0를 통해 UI를 생성하고, Vercel로 배포됩니다.

---

## 🔗 Live Demo

**Frontend URL**  
👉 https://shoemoa-frontend-79l17mixy-aqwsde321s-projects.vercel.app/

---

## 🛠 Tech Stack

- React (v0 generated)
- Tailwind CSS
- shadcn/ui
- Vercel (Hosting)
- Spring Boot REST API 연동 예정

---

## 📦 Project Overview

이 프로젝트는 다음 화면을 포함합니다.

### 사용자 화면
- 회원가입 / 로그인
- 상품 목록 (검색 / 정렬)
- 상품 상세
- 장바구니
- 주문

### 관리자 화면
- 상품 목록 조회
- 상품 등록 / 수정 / 삭제
- 모바일 반응형 지원

> 현재는 UI 중심으로 구성되어 있으며,  
> 백엔드(Spring REST API) 연동은 단계적으로 진행 중입니다.

---

## 🚀 Deployment

- **Hosting**: Vercel
- **Project Dashboard**  
  https://vercel.com/aqwsde321s-projects/shoemoa-frontend/GmUBnNvEeisMx8G3yjtBxuJBiFL9

- `main` 브랜치에 push 시 자동 배포됩니다.

---

## 🔧 Environment Variables

API 주소는 환경변수로 관리합니다.

```bash
VITE_API_BASE_URL=https://api.your-domain.com
