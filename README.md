# MediMap AI

Stitch 디자인 시안을 바탕으로 구현한 반응형 Next.js 의료 안내 웹 애플리케이션입니다. 현재 버전은 mock 데이터로 전체 흐름을 체험할 수 있으며, 이후 Supabase와 식품의약품안전처 공공데이터 OpenAPI를 연결할 수 있도록 데이터 접근 계층을 분리했습니다.

## 주요 기능

- 증상 입력 및 상세 문진
- Zod 기반 한국어 입력 검증
- AI 분석 전 규칙 기반 응급 위험 신호 검사
- mock 분석 API와 분석 결과 화면
- 의약품 mock 검색/상세 API
- 네이버 지도 JavaScript API 연결 준비
- 대구광역시 계명대학교 주변 mock 병원, 약국, 응급실 데이터
- Haversine 거리 계산 및 가까운 순 정렬
- 검색 기록 저장 선택 UI와 브라우저 로컬 저장
- 건강정보 및 위치정보 동의/안내 UI

## 기술 스택

- Next.js 16.2.10
- React 19.2.7
- TypeScript strict mode
- App Router
- Tailwind CSS 4
- React Hook Form
- Zod
- Zustand
- Next.js Route Handlers
- Supabase 저장소 연동 준비

## 설치 및 실행

```bash
npm install
npm run dev
```

개발 서버 실행 후 브라우저에서 표시되는 로컬 주소로 접속합니다.

검사 명령:

```bash
npm run lint
npm run typecheck
npm run build
```

## Netlify 배포

Netlify에 배포할 때는 로컬의 `.env.local`을 읽지 않습니다. Netlify Dashboard의 환경변수에 같은 값을 직접 등록해야 합니다.

필수 환경변수:

```bash
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
MFDS_API_SERVICE_KEY=
```

Netlify 설정:

- Build command: `npm run build`
- Publish directory: `.next`
- Next.js plugin: `@netlify/plugin-nextjs`

환경변수를 추가하거나 바꾼 뒤에는 `Deploys → Trigger deploy → Clear cache and deploy site`로 다시 배포하세요.

네이버 지도 콘솔의 Web 서비스 URL에는 배포 도메인을 등록해야 합니다.

```text
https://elegant-cucurucho-831f8b.netlify.app
https://elegant-cucurucho-831f8b.netlify.app/
```

## 환경변수

`.env.local`을 만들고 필요한 값만 설정합니다.

```bash
MFDS_API_SERVICE_KEY=
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

- `MFDS_API_SERVICE_KEY`: 서버에서만 사용합니다. 브라우저에 노출하지 않습니다.
- `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`: 네이버 지도 JavaScript API 로딩에 사용합니다. 값이 없으면 mock 지도 영역이 표시됩니다.
- `SUPABASE_URL`: Supabase 프로젝트 URL입니다. 서버 Route Handler에서만 사용합니다.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key입니다. 절대 브라우저에 노출하지 말고 `.env.local`에만 저장하세요.

## Supabase 저장 시스템 설정

현재 로그인 기능이 없으므로 브라우저에는 건강정보 대신 임의의 `deviceId`만 저장합니다. 사용자가 "검색 기록 저장"을 선택한 분석만 Next.js Route Handler를 통해 Supabase에 저장됩니다.

1. Supabase 프로젝트를 생성합니다.
2. SQL Editor에서 `supabase/schema.sql` 내용을 실행합니다.
3. `.env.local`에 `SUPABASE_URL`과 `SUPABASE_SERVICE_ROLE_KEY`를 설정합니다.
4. 개발 서버를 재시작합니다.

저장 테이블:

- `public.medimap_analysis_history`

보안 구조:

- 테이블 RLS는 활성화되어 있습니다.
- 직접 클라이언트 접근 정책은 차단되어 있습니다.
- 앱은 `/api/history` Route Handler에서 service role key로만 저장, 조회, 삭제합니다.
- 사용자가 검색 기록 저장을 선택하지 않으면 Supabase에 저장하지 않습니다.

## API 신청 안내

### 식품의약품안전처 의약품 API

1. 공공데이터포털에서 식품의약품안전처 의약품 관련 OpenAPI를 검색합니다.
2. 의약품개요정보 e약은요 OpenAPI와 의약품 제품 허가정보 OpenAPI 활용 신청을 진행합니다.
3. 발급받은 서비스 키를 `MFDS_API_SERVICE_KEY`에 설정합니다.
4. 실제 연동은 `src/lib/api/mfds.ts`에서 외부 응답을 `Medicine` 인터페이스로 정규화하면 됩니다.

의약품안전나라 웹페이지 직접 크롤링은 사용하지 않는 구조입니다.

### 네이버 지도 JavaScript API

1. 네이버 클라우드 플랫폼에서 Maps JavaScript API 이용 신청을 진행합니다.
2. 웹 서비스 URL을 등록합니다.
3. 발급받은 Client ID를 `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`에 설정합니다.

## 주요 경로

- `/`: 메인 증상 입력
- `/symptom`: 상세 증상 입력
- `/analysis/loading`: 분석 진행 화면
- `/analysis/result`: 분석 결과
- `/map`: 주변 병원 및 약국 지도
- `/medicine/[id]`: 의약품 상세정보
- `/history`: 검색 기록
- `/emergency`: 응급 안내

## 개인정보 처리 원칙

- 사용자가 검색 기록 저장을 선택하지 않으면 증상 입력 내용은 localStorage에 저장하지 않습니다.
- 브라우저 Geolocation API로 받은 정확한 좌표는 localStorage나 서버에 영구 저장하지 않습니다.
- 서버 Route Handler에서 증상, 알레르기, 복용약 등 민감정보를 로그로 출력하지 않습니다.
- 분석 결과와 의약품 정보는 참고용이며 의료진의 진단이나 약사의 복약 지도를 대체하지 않습니다.
